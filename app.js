import {validateGuide, validateProject, progressOf, pageCandidates, parseRoute, routeHash, breadcrumb, neighbors, defaultView, openTasks, parseRepo, frameworkStatus, shaFromGit, commitState} from './model.js';
const $=s=>document.querySelector(s), labels={R:'Ready',I:'In process',P:'Pending',N:'Not applicable'};
let guide,project,manifest=null,route={name:'home'},routeToken=0,filters=new Set(),query='',found=new Map(),resolved=new Map(),navigated=false;
const el=(tag,props={},text)=>{const node=document.createElement(tag);Object.assign(node,props);if(text!==undefined)node.textContent=text;return node;};
const link=(href,text,props={})=>el('a',{href,...props},text);
function report(message){$('#error').textContent=message;$('#error').hidden=false;}

// ---- data helpers
const itemOf=id=>{for(const c of guide.categories){const i=c.items.find(x=>x.id===id);if(i)return i;}};
const catOf=id=>guide.categories.find(c=>c.id===id||c.items.some(i=>i.id===id));
const statusTag=s=>{const t=el('span',{className:'status-tag'},`${s} · ${labels[s]}`);t.dataset.value=s;return t;};
function pageExists(path){if(!found.has(path))found.set(path,fetch(path,{method:'HEAD',cache:'no-store'}).then(r=>r.ok&&/text\/html/i.test(r.headers.get('content-type')||'')).catch(()=>false));return found.get(path);}
function resolvePage(i,p){if(!resolved.has(i.id)){const c=pageCandidates(i,p);resolved.set(i.id,p.page?Promise.resolve(p.page):Promise.all(c.map(pageExists)).then(r=>{const k=r.indexOf(true);return k>=0?c[k]:null;}));}return resolved.get(i.id);}
function visible(){return guide.categories.map(c=>({c,items:c.items.filter(i=>(!filters.size||filters.has(project.sections[i.id].status))&&`${i.number} ${i.title} ${i.define} ${c.title}`.toLocaleLowerCase('en').includes(query))})).filter(v=>v.items.length);}

// ---- rail: status filter and sections menu
function stats(){const counts={R:0,I:0,P:0,N:0};Object.values(project.sections).forEach(s=>counts[s.status]++);document.querySelectorAll('[data-count]').forEach(n=>n.textContent=counts[n.dataset.count]);}
function syncFilters(){document.querySelectorAll('[data-filter]').forEach(c=>{c.checked=c.dataset.filter==='all'?!filters.size:filters.has(c.dataset.filter);});$('#state-btn').dataset.active=String(filters.size>0||!!query);}
const canHover=matchMedia('(hover:hover) and (min-width:951px)');
let closeTimer=null;
function openCat(cat){clearTimeout(closeTimer);document.querySelectorAll('.menu-cat.open').forEach(x=>{if(x!==cat)x.classList.remove('open');});cat.classList.add('open');
  const sub=cat.querySelector('.submenu');if(canHover.matches&&sub){const wrap=$('#menu-wrap').getBoundingClientRect(),row=cat.getBoundingClientRect();sub.style.left=`${wrap.right}px`;sub.style.top=`${Math.max(8,Math.min(row.top,innerHeight-sub.offsetHeight-8))}px`;}}
function closeCat(cat){closeTimer=setTimeout(()=>{if(!cat.matches(':hover,:focus-within'))cat.classList.remove('open');},140);}
function renderMenu(view){const menu=$('#menu'),top=menu.scrollTop,focusKey=document.activeElement&&menu.contains(document.activeElement)?document.activeElement.dataset.key:null;menu.replaceChildren();
for(const {c,items} of view){const within=(route.name==='category'||route.name==='section')&&catOf(route.id).id===c.id,cat=el('div',{className:'menu-cat'}),row=el('div',{className:'menu-cat-row'});if(within)cat.dataset.current='true';
const a=link(`#/${c.id}`,'',{className:'menu-cat-link'});a.dataset.key=`c-${c.id}`;a.setAttribute('aria-haspopup','true');a.append(el('span',{className:'menu-num'},String(c.number).padStart(2,'0')),el('span',{},c.title));if(route.name==='category'&&route.id===c.id)a.setAttribute('aria-current','page');
const chev=el('button',{className:'menu-chevron',type:'button'});chev.setAttribute('aria-label',`${c.title}: show subsections`);chev.onclick=()=>{cat.classList.toggle('open');};
row.append(a,chev);const list=el('ul',{className:'submenu',id:`menu-${c.id}`});list.setAttribute('aria-label',`${c.title} subsections`);
for(const i of items){const p=project.sections[i.id],li=el('li'),x=link(`#/${i.id}`,'',{className:'menu-item'});x.dataset.key=`i-${i.id}`;x.append(el('span',{className:'menu-num'},i.number),el('span',{className:'menu-title'},i.title));const b=el('span',{className:'menu-status'},p.status);b.dataset.value=p.status;b.append(el('span',{className:'sr-only'},` · ${labels[p.status]}`));x.append(b);if(route.name==='section'&&route.id===i.id)x.setAttribute('aria-current','page');li.append(x);list.append(li);}
cat.append(row,list);
cat.addEventListener('mouseenter',()=>{if(canHover.matches)openCat(cat);});cat.addEventListener('mouseleave',()=>{if(canHover.matches)closeCat(cat);});
cat.addEventListener('focusin',()=>{if(canHover.matches)openCat(cat);});cat.addEventListener('focusout',()=>{if(canHover.matches)closeCat(cat);});
menu.append(cat);}
menu.scrollTop=top;if(focusKey)menu.querySelector(`[data-key="${CSS.escape(focusKey)}"]`)?.focus({preventScroll:true});}
function onFilterChange(){syncFilters();renderMenu(visible());if(route.name==='home'||route.name==='category')renderRoute(routeToken);}

// ---- header: breadcrumb, status, views, pager
function renderHead(item,entry,page,effective){
  const crumbs=$('#crumbs');crumbs.replaceChildren();
  breadcrumb(guide,route,project.name).forEach((c,k,all)=>{const li=el('li');if(c.hash&&k<all.length-1)li.append(link(c.hash,c.label));else{const s=el('span',{},c.label);s.setAttribute('aria-current','page');li.append(s);}crumbs.append(li);});
  const section=route.name==='section',views=$('#views'),status=$('#head-status'),pager=$('#pager');
  views.hidden=status.hidden=pager.hidden=$('#sep-views').hidden=$('#sep-pager').hidden=!section;
  if(!section)return;
  views.replaceChildren(...[['content','Content'],['info','Info'],['record','Record']].map(([v,t])=>{const a=link(`#/${item.id}/${v}`,t);if(v===effective)a.setAttribute('aria-current','page');return a;}));
  status.textContent=`${entry.status} · ${labels[entry.status]}`;status.dataset.value=entry.status;
  const n=neighbors(guide,item.id);pager.replaceChildren(...[['prev','‹','Previous'],['next','›','Next']].map(([k,glyph,word])=>{const id=n[k];if(!id){const s=el('span',{className:'pager-btn'},glyph);s.setAttribute('aria-disabled','true');s.setAttribute('aria-label',`${word} section (none)`);return s;}return link(`#/${id}`,glyph,{className:'pager-btn',title:`${word}: ${itemOf(id).title}`,ariaLabel:`${word} section: ${itemOf(id).title}`});}));
}

// ---- views
function viewHome(){
  const wrap=el('div',{className:'view-inner'}),total=guide.categories.reduce((n,c)=>n+c.items.length,0),p=progressOf(project);
  wrap.append(el('h1',{id:'view-title'},project.name),el('p',{className:'lead'},`${total} subsections in ${guide.categories.length} categories.`));
  const meter=(title,value,text)=>{const m=el('div',{className:'meter'}),h=el('div',{className:'meter-head'});h.append(el('span',{},title),el('span',{},text));const bar=el('progress',{max:100,value:value||0});bar.setAttribute('aria-label',`${title}: ${text}`);m.append(h,bar);return m;};
  const meters=el('div',{className:'meters'});meters.append(meter('Progress',p.percent,p.applicable?`${p.ready} of ${p.applicable} applicable ready`:'No applicable sections'),meter('Complexity',p.scope,`${p.applicable} of ${p.total} not N`));wrap.append(meters);
  const cards=el('div',{className:'cards'});
  for(const {c} of visible()){const counts={R:0,I:0,P:0,N:0};c.items.forEach(i=>counts[project.sections[i.id].status]++);const applicable=c.items.length-counts.N,card=link(`#/${c.id}`,'',{className:'card'});
    const bar=el('progress',{max:100,value:applicable?Math.round(counts.R/applicable*100):0});bar.setAttribute('aria-label',`${c.title}: ${counts.R} of ${applicable} applicable subsections ready`);
    card.append(el('span',{className:'card-num'},String(c.number).padStart(2,'0')),el('span',{className:'card-title'},c.title),el('span',{className:'card-text'},c.objective),bar,el('span',{className:'card-counts'},Object.keys(labels).map(s=>`${s} ${counts[s]}`).join(' · ')));cards.append(card);}
  if(!cards.childNodes.length)cards.append(el('p',{className:'no-results'},'No categories match these filters. Try another status or search.'));
  wrap.append(cards);
  const foot=el('p',{className:'muted small'});foot.append('Read-only: everything is edited in Claude Design. ',link('README.md','README'),' · ',link('CLAUDE.md','Agent guide'));wrap.append(foot);return wrap;
}
function viewCategory(c){
  const wrap=el('div',{className:'view-inner'}),items=visible().find(v=>v.c.id===c.id)?.items||[];
  wrap.append(el('h1',{id:'view-title'},`${String(c.number).padStart(2,'0')} ${c.title}`),el('p',{className:'lead'},c.objective));
  const list=el('ul',{className:'rows'});
  for(const i of items){const li=el('li'),a=link(`#/${i.id}`,'',{className:'row'});a.append(el('span',{className:'row-num'},i.number),el('span',{className:'row-title'},i.title),statusTag(project.sections[i.id].status));li.append(a);list.append(li);}
  wrap.append(list);if(!items.length)wrap.append(el('p',{className:'no-results'},'No subsections match these filters. Try another status or search.'));
  wrap.append(el('p',{className:'muted small'},`${items.length} of ${c.items.length} subsections shown.`));return wrap;
}
function viewInfo(i){
  const wrap=el('div',{className:'view-inner'});wrap.append(el('h1',{id:'view-title'},i.title));
  const grid=el('div',{className:'guide-grid'});
  for(const [title,value] of [['Objective',i.objective],['What to define',i.define],['Accessibility',i.accessibility],['Expected deliverable',i.deliverable]]){const box=el('div');box.append(el('h2',{},title),el('p',{},value));grid.append(box);}
  const box=el('div',{className:'wide'}),ul=el('ul');box.append(el('h2',{},'Acceptance criteria'));for(const t of i.acceptance)ul.append(el('li',{},t));box.append(ul);grid.append(box);wrap.append(grid);return wrap;
}
function viewRecord(i,p,page){
  const wrap=el('div',{className:'view-inner'});wrap.append(el('h1',{id:'view-title'},i.title));
  const rec=el('div',{className:'record'}),field=(title,node,wide)=>{const box=el('div',wide?{className:'wide'}:{});box.append(el('h2',{},title));box.append(node);rec.append(box);};
  const text=v=>el('p',{className:v?'':'muted'},v||'Not recorded');
  field('Status',(()=>{const d=el('div',{className:'status-line'});d.append(statusTag(p.status),el('span',{className:'muted small'},'Read-only: the status is changed in Claude Design.'));return d;})());
  field('Owner',text(p.owner));
  field('Page',text(page||`No page · expected at ${i.suggestedPath}`));
  field('Decisions and notes',text(p.notes),true);
  const t=openTasks(p),tasks=el('div',{className:'tasks'});
  for(const [title,list] of [['Pending',t.pending],['Future',t.future]]){if(!list.length)continue;tasks.append(el('h3',{},title));const ul=el('ul');list.forEach(x=>ul.append(el('li',{},x.text)));tasks.append(ul);}
  if(!tasks.childNodes.length)tasks.append(el('p',{className:'muted'},'No tasks.'));else tasks.append(el('p',{className:'muted small'},'Tasks never block Ready.'));
  field('Tasks',tasks,true);
  if(p.status==='N')field('Exclusion reason',text(p.exclusionReason),true);
  field('Review · name',text(p.review.by));field('Review · date',text(p.review.date));field('Review · evidence',text(p.review.evidence),true);
  wrap.append(rec);return wrap;
}
function viewContent(i,page){
  if(page){const f=el('iframe',{src:page,title:`Page for ${i.title}`,referrerPolicy:'no-referrer'});f.setAttribute('sandbox','allow-scripts');return f;}
  const wrap=el('div',{className:'view-inner'});wrap.append(el('h1',{id:'view-title'},i.title));
  const empty=el('div',{className:'empty'});empty.append(el('h2',{},'No page yet'),el('p',{},'This section does not have a page at its expected path:'),el('code',{},i.suggestedPath),link(`#/${i.id}/info`,'Read the info'));wrap.append(empty);return wrap;
}

// ---- framework page: what the project is built on and where it lives (the only network calls are the two manual checks)
async function getJson(url){const r=await fetch(url,{cache:'no-store',headers:{Accept:'application/json'}});if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json();}
async function readLocalCommit(){
  const text=async p=>{try{const r=await fetch(p,{cache:'no-store'});return r.ok?await r.text():null;}catch{return null;}};
  const head=await text('.git/HEAD');if(!head)return null;
  const ref=head.trim().match(/^ref: (\S+)$/)?.[1];
  return shaFromGit(head,ref?await text(`.git/${ref}`):null,ref?await text('.git/packed-refs'):null);
}
function aboutBlock(title,rows,checkFn,hint){
  const block=el('section',{className:'about-block'}),dl=el('dl'),status=el('p',{className:'about-status'});status.setAttribute('role','status');
  block.append(el('h2',{},title));
  for(const [k,v] of rows){const dd=el('dd');dd.append(v instanceof Node?v:document.createTextNode(v));dl.append(el('dt',{},k),dd);}
  block.append(dl);
  const actions=el('div',{className:'about-actions'});
  if(checkFn){const btn=el('button',{type:'button'},'Check for updates');
    btn.onclick=async()=>{btn.disabled=true;status.textContent='Checking…';try{status.textContent=await checkFn();}catch(e){status.textContent=`Could not check: ${e.message}. It needs a connection, and private repositories cannot be read from the browser.`;}finally{btn.disabled=false;}};
    actions.append(btn,status);}
  else actions.append(el('p',{className:'about-status'},hint));
  block.append(actions);return block;
}
function viewFramework(){
  const wrap=el('div',{className:'view-inner'}),about=el('div',{className:'about'});
  wrap.append(el('h1',{id:'view-title'},'Framework'),el('p',{className:'lead about-intro'},'DSBook is a tool that guides the development of a Design System and its evolution over time. It lists what a complete system should define, gives every subsection a page and a record, and shows at a glance what is ready, in process, pending or not applicable. Pick a subsection in the Sections menu, read what it asks for, develop it in Claude Design and record its status; this site only shows the state of the repository.'));
  const m=manifest,src=m&&parseRepo(m.repository),ext=url=>link(url,url.replace('https://',''),{target:'_blank',rel:'noopener noreferrer'});
  about.append(aboutBlock('DSBook framework',
    m?[['Version',m.version],['Released',m.released||'Not recorded'],['Source',src?ext(m.repository):'Not recorded']]:[['Version','dsbook.json was not found']],
    src&&m?async()=>{
      const remote=await getJson(`https://raw.githubusercontent.com/${src.owner}/${src.repo}/HEAD/dsbook.json`),s=frameworkStatus(m,remote),n=s.differ.length;
      if(s.state==='current')return `Up to date: DSBook ${s.local}.`;
      if(s.state==='update')return `Update available: ${s.local} → ${s.remote}${remote.released?` (released ${remote.released})`:''}. ${n} framework file${n===1?'':'s'} differ.`;
      if(s.state==='ahead')return `This project is ahead of its source (${s.local} here, ${s.remote} there). The change still has to be ported to DSBook.`;
      return `Same version (${s.local}) but ${n} framework file${n===1?'':'s'} differ: ${s.differ.join(', ')}.`;
    }:null,'The source repository is not recorded in dsbook.json.'));
  const repo=parseRepo(project.repository),last=el('span',{},'Shown after checking');
  about.append(aboutBlock('This project',
    [['Project',project.name],['Repository',repo?ext(project.repository):'Not set'],['Last commit',last]],
    repo?async()=>{
      const api=`https://api.github.com/repos/${repo.owner}/${repo.repo}`,top=await getJson(`${api}/commits/HEAD`);
      last.textContent=`${top.commit.message.split('\n')[0]} · ${top.sha.slice(0,7)} · ${top.commit.author.date.slice(0,10)}`;
      const local=await readLocalCommit();
      if(!local)return 'Your copy’s commit could not be read, so it cannot be compared. Serve the site from the repository folder.';
      let cmp=null;try{cmp=await getJson(`${api}/compare/${local}...${top.sha}`);}catch(e){if(e.message!=='HTTP 404')throw e;}
      const r=commitState(cmp),c=r.count;
      if(r.state==='current')return 'Up to date with GitHub.';
      if(r.state==='update')return `GitHub has ${c} newer commit${c===1?'':'s'} than this copy. Pull them before working.`;
      if(r.state==='unpushed')return `This copy has commits that are not on GitHub${c?` (${c})`:''}.`;
      return 'This copy and GitHub have diverged: both have commits the other lacks.';
    }:null,'Set "repository" in data/project.json to check the project’s repository.'));
  wrap.append(about);return wrap;
}

// ---- routing
async function renderRoute(t){
  const view=$('#view'),name=project.name;view.classList.remove('frame');view.removeAttribute('aria-label');
  let node,title=name,item,entry,page=null,effective=null;
  if(route.name==='section'){
    item=itemOf(route.id);entry=project.sections[item.id];page=await resolvePage(item,entry);if(t!==routeToken)return;
    effective=route.view||defaultView(entry,!!page);
    node=effective==='content'?viewContent(item,page):effective==='info'?viewInfo(item):viewRecord(item,entry,page);
    title=`${item.number} ${item.title}`;if(effective==='content'&&page)view.classList.add('frame');
  }else if(route.name==='category'){const c=catOf(route.id);node=viewCategory(c);title=c.title;}
  else if(route.name==='framework'){node=viewFramework();title='Framework';}
  else if(route.name==='home')node=viewHome();
  else{node=el('div',{className:'view-inner'});node.append(el('h1',{id:'view-title'},'Page not found'),el('p',{},`There is nothing at ${route.hash||'this address'}.`),link('#/','Go to the home page'));}
  renderHead(item,entry,page,effective);
  if(node.tagName==='IFRAME'){view.setAttribute('aria-label',`${title} page`);view.removeAttribute('aria-labelledby');view.replaceChildren(node);}else{view.setAttribute('aria-labelledby','view-title');view.replaceChildren(node);}
  document.title=route.name==='home'?`DSBook · ${name}`:`${title} · DSBook · ${name}`;
  view.scrollTop=0;if(navigated)view.focus({preventScroll:true});navigated=true;
}
async function go(){
  const t=++routeToken;route=parseRoute(location.hash,guide);
  if(route.name!=='notfound'&&location.hash!==routeHash(route)&&!location.hash.startsWith('#/'))history.replaceState(null,'',routeHash(route));
  renderMenu(visible());closeFlyout();await renderRoute(t);
}

// ---- rail behavior: dropdown panels open on hover, pin with a click and close with Escape
const side=$('#sidebar');
const panels={state:{btn:$('#state-btn'),el:$('#panel-state')},sections:{btn:$('#sections-btn'),el:$('#menu-wrap')}};
let pinned=null,hover=null,leaveTimer=null;
function current(){if(pinned)return pinned;if(hover)return hover;return Object.keys(panels).find(k=>panels[k].el.contains(document.activeElement))||null;}
function applyFlyout(){const c=current();side.dataset.panel=c||'';for(const k in panels)panels[k].btn.setAttribute('aria-expanded',String(k===c));if(!c)document.querySelectorAll('.menu-cat.open').forEach(x=>x.classList.remove('open'));}
function closeFlyout(){pinned=null;hover=null;clearTimeout(leaveTimer);if(side.contains(document.activeElement)&&document.activeElement!==document.body)document.activeElement.blur();applyFlyout();}
for(const [k,{btn,el:pel}] of Object.entries(panels)){
btn.onclick=()=>{if(pinned===k)closeFlyout();else{pinned=k;applyFlyout();}};
for(const n of [btn,pel]){n.addEventListener('mouseenter',()=>{if(!matchMedia('(hover:hover)').matches)return;clearTimeout(leaveTimer);hover=k;applyFlyout();});n.addEventListener('mouseleave',()=>{clearTimeout(leaveTimer);leaveTimer=setTimeout(()=>{if(hover===k)hover=null;applyFlyout();},250);});}
pel.addEventListener('focusout',()=>setTimeout(applyFlyout,0));}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&side.dataset.panel){const k=current();closeFlyout();panels[k]?.btn.focus();}});
document.addEventListener('click',e=>{if(pinned&&e.target.isConnected&&!side.contains(e.target))closeFlyout();});
$('#menu').addEventListener('click',e=>{if(e.target.closest('a'))closeFlyout();});

// ---- search (header) and status filters (rail)
const setQuery=v=>{query=v.trim().toLocaleLowerCase('en');if($('#search').value!==v)$('#search').value=v;onFilterChange();};
function searchOpen(open,focus){const box=$('#head-search'),input=$('#search');box.classList.toggle('open',open);input.hidden=!open;$('#search-toggle').setAttribute('aria-expanded',String(open));if(open&&focus)input.focus();}
$('#search-toggle').onclick=()=>{const open=!$('#head-search').classList.contains('open');if(!open&&$('#search').value){setQuery('');}searchOpen(open,true);};
$('#search').onkeydown=e=>{if(e.key==='Escape'){e.stopPropagation();setQuery('');searchOpen(false);$('#search-toggle').focus();}};
$('#search').onblur=()=>{if(!$('#search').value)searchOpen(false);};
$('#search').oninput=e=>setQuery(e.target.value);
$('#panel-state').addEventListener('change',e=>{const s=e.target.dataset.filter;if(!s)return;if(s==='all')filters.clear();else filters.has(s)?filters.delete(s):filters.add(s);onFilterChange();});

// ---- start
async function init(){try{const results=await Promise.all(['guide','project'].map(async n=>{const r=await fetch(`data/${n}.json`,{cache:'no-store'});if(!r.ok)throw Error(`Could not read ${n}.json`);return r.json();}));[guide,project]=results;manifest=await fetch('dsbook.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);validateGuide(guide);validateProject(project,guide);stats();syncFilters();window.addEventListener('hashchange',go);await go();}catch(e){report(`${e.message}. Start the local server described in README.md; opening index.html with file:// cannot load the JSON files.`);}}
init();
