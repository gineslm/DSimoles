import {validateGuide, validateProject, progressOf, pageCandidates, parseRoute, routeHash, breadcrumb, neighbors, defaultView, openTasks} from './model.js';
const $=s=>document.querySelector(s), labels={R:'Ready',I:'In process',P:'Pending',N:'Not applicable'};
let guide,project,route={name:'home'},routeToken=0,menuOpen=new Set(),filters=new Set(),query='',found=new Map(),resolved=new Map(),navigated=false;
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

// ---- sidebar: progress, filters and menu
function stats(){const counts={R:0,I:0,P:0,N:0};Object.values(project.sections).forEach(s=>counts[s.status]++);for(const s of Object.keys(labels))document.querySelectorAll(`[data-status="${s}"] span,[data-count="${s}"]`).forEach(n=>n.textContent=counts[s]);const p=progressOf(project);$('#result-count').textContent=`${p.ready}/${p.applicable}`;$('#progress').value=p.percent||0;$('#scope-progress').value=p.scope||0;$('#project-title').textContent=project.name;$('#mobile-title').textContent=`DSBook · ${project.name}`;}
function syncFilters(){for(const n of $('#filters').querySelectorAll('button'))n.setAttribute('aria-pressed',String(n.dataset.status==='all'?!filters.size:filters.has(n.dataset.status)));document.querySelectorAll('[data-filter]').forEach(c=>{c.checked=c.dataset.filter==='all'?!filters.size:filters.has(c.dataset.filter);});}
function renderMenu(view,reveal){const menu=$('#menu'),top=menu.scrollTop,focusKey=document.activeElement&&menu.contains(document.activeElement)?document.activeElement.dataset.key:null,auto=!!query||filters.size>0;menu.replaceChildren();
for(const {c,items} of view){const open=auto||menuOpen.has(c.id),sec=el('div',{className:'menu-cat'}),row=el('div',{className:'menu-cat-row'});
const tog=el('button',{className:'menu-toggle',disabled:auto});tog.dataset.key=`t-${c.id}`;tog.setAttribute('aria-expanded',String(open));tog.setAttribute('aria-controls',`menu-${c.id}`);tog.setAttribute('aria-label',`${c.title}: ${open?'collapse':'expand'} subsections`);tog.onclick=()=>{open?menuOpen.delete(c.id):menuOpen.add(c.id);renderMenu(view);};
const a=link(`#/${c.id}`,'',{className:'menu-cat-link'});a.dataset.key=`c-${c.id}`;a.append(el('span',{className:'menu-num'},String(c.number).padStart(2,'0')),el('span',{},c.title));if(route.name==='category'&&route.id===c.id)a.setAttribute('aria-current','page');
row.append(tog,a);const list=el('ul',{className:'menu-items',id:`menu-${c.id}`,hidden:!open});
for(const i of items){const p=project.sections[i.id],li=el('li'),x=link(`#/${i.id}`,'',{className:'menu-item'});x.dataset.key=`i-${i.id}`;x.dataset.item=i.id;x.append(el('span',{className:'menu-num'},i.number),el('span',{className:'menu-title'},i.title));const b=el('span',{className:'menu-status'},p.status);b.dataset.value=p.status;b.append(el('span',{className:'sr-only'},` · ${labels[p.status]}`));x.append(b);if(route.name==='section'&&route.id===i.id)x.setAttribute('aria-current','page');li.append(x);list.append(li);}
sec.append(row,list);menu.append(sec);}
menu.scrollTop=top;if(focusKey)menu.querySelector(`[data-key="${CSS.escape(focusKey)}"]`)?.focus({preventScroll:true});
const cur=menu.querySelector('[aria-current]');if(reveal&&cur&&cur.offsetParent){const t=cur.getBoundingClientRect(),m=menu.getBoundingClientRect();if(t.top<m.top+8||t.bottom>m.bottom-8)menu.scrollTop+=t.top-m.top-m.height/3;}}
function onFilterChange(){stats();syncFilters();renderMenu(visible());if(route.name==='home'||route.name==='category')renderRoute(routeToken);}

// ---- header: breadcrumb, status, views, pager
function renderHead(item,entry,page,effective){
  const crumbs=$('#crumbs');crumbs.replaceChildren();
  breadcrumb(guide,route,project.name).forEach((c,k,all)=>{const li=el('li');if(c.hash&&k<all.length-1)li.append(link(c.hash,c.label));else{const s=el('span',{},c.label);s.setAttribute('aria-current','page');li.append(s);}crumbs.append(li);});
  const section=route.name==='section',views=$('#views'),status=$('#head-status'),open=$('#open-link'),pager=$('#pager');
  views.hidden=status.hidden=pager.hidden=!section;open.hidden=!(section&&page&&effective==='content');
  if(!section)return;
  views.replaceChildren(...[['content','Content'],['guide','Guide'],['record','Record']].map(([v,t])=>{const a=link(`#/${item.id}/${v}`,t);if(v===effective)a.setAttribute('aria-current','page');return a;}));
  status.textContent=`${entry.status} · ${labels[entry.status]}`;status.dataset.value=entry.status;
  if(page)open.href=page;
  const n=neighbors(guide,item.id);pager.replaceChildren(...[['prev','‹','Previous'],['next','›','Next']].map(([k,glyph,word])=>{const id=n[k];if(!id){const s=el('span',{className:'pager-btn'},glyph);s.setAttribute('aria-disabled','true');s.setAttribute('aria-label',`${word} section (none)`);return s;}return link(`#/${id}`,glyph,{className:'pager-btn',title:`${word}: ${itemOf(id).title}`,ariaLabel:`${word} section: ${itemOf(id).title}`});}));
}

// ---- views
function viewHome(){
  const wrap=el('div',{className:'view-inner'}),total=guide.categories.reduce((n,c)=>n+c.items.length,0);
  wrap.append(el('h1',{id:'view-title'},project.name),el('p',{className:'lead'},`${total} subsections in ${guide.categories.length} categories.`));
  const cards=el('div',{className:'cards'});
  for(const {c} of visible()){const counts={R:0,I:0,P:0,N:0};c.items.forEach(i=>counts[project.sections[i.id].status]++);const applicable=c.items.length-counts.N,card=link(`#/${c.id}`,'',{className:'card'});
    const bar=el('progress',{max:100,value:applicable?Math.round(counts.R/applicable*100):0});bar.setAttribute('aria-label',`${c.title}: ${counts.R} of ${applicable} applicable subsections ready`);
    card.append(el('span',{className:'card-num'},String(c.number).padStart(2,'0')),el('span',{className:'card-title'},c.title),el('span',{className:'card-text'},c.objective),bar,el('span',{className:'card-counts'},Object.keys(labels).map(s=>`${s} ${counts[s]}`).join(' · ')));cards.append(card);}
  if(!cards.childNodes.length)cards.append(el('p',{className:'no-results'},'No categories match these filters. Try another status or search.'));
  wrap.append(cards);return wrap;
}
function viewCategory(c){
  const wrap=el('div',{className:'view-inner'}),items=visible().find(v=>v.c.id===c.id)?.items||[];
  wrap.append(el('h1',{id:'view-title'},`${String(c.number).padStart(2,'0')} ${c.title}`),el('p',{className:'lead'},c.objective));
  const list=el('ul',{className:'rows'});
  for(const i of items){const li=el('li'),a=link(`#/${i.id}`,'',{className:'row'});a.append(el('span',{className:'row-num'},i.number),el('span',{className:'row-title'},i.title),statusTag(project.sections[i.id].status));li.append(a);list.append(li);}
  wrap.append(list);if(!items.length)wrap.append(el('p',{className:'no-results'},'No subsections match these filters. Try another status or search.'));
  wrap.append(el('p',{className:'muted small'},`${items.length} of ${c.items.length} subsections shown.`));return wrap;
}
function viewGuide(i){
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
  const empty=el('div',{className:'empty'});empty.append(el('h2',{},'No page yet'),el('p',{},'This section does not have a page at its expected path:'),el('code',{},i.suggestedPath),link(`#/${i.id}/guide`,'Read the guide'));wrap.append(empty);return wrap;
}

// ---- routing
async function renderRoute(t){
  const view=$('#view'),name=project.name;view.classList.remove('frame');view.removeAttribute('aria-label');
  let node,title=name,item,entry,page=null,effective=null;
  if(route.name==='section'){
    item=itemOf(route.id);entry=project.sections[item.id];page=await resolvePage(item,entry);if(t!==routeToken)return;
    effective=route.view||defaultView(entry,!!page);
    node=effective==='content'?viewContent(item,page):effective==='guide'?viewGuide(item):viewRecord(item,entry,page);
    title=`${item.number} ${item.title}`;if(effective==='content'&&page)view.classList.add('frame');
  }else if(route.name==='category'){const c=catOf(route.id);node=viewCategory(c);title=c.title;}
  else if(route.name==='home')node=viewHome();
  else{node=el('div',{className:'view-inner'});node.append(el('h1',{id:'view-title'},'Page not found'),el('p',{},`There is nothing at ${route.hash||'this address'}.`),link('#/','Go to the home page'));}
  renderHead(item,entry,page,effective);
  if(node.tagName==='IFRAME'){view.setAttribute('aria-label',`${title} page`);view.removeAttribute('aria-labelledby');view.replaceChildren(node);}else{view.setAttribute('aria-labelledby','view-title');view.replaceChildren(node);}
  document.title=route.name==='home'?`DSBook · ${name}`:`${title} · DSBook · ${name}`;
  view.scrollTop=0;if(navigated)view.focus({preventScroll:true});navigated=true;
}
async function go(){
  const t=++routeToken;route=parseRoute(location.hash,guide);
  if(route.name==='section'||route.name==='category')menuOpen.add(catOf(route.id).id);
  if(route.name!=='notfound'&&location.hash!==routeHash(route)&&!location.hash.startsWith('#/'))history.replaceState(null,'',routeHash(route));
  renderMenu(visible(),true);setDrawer(false);closeFlyout();await renderRoute(t);
}

// ---- sidebar behavior (collapse, flyouts, drawer)
function setDrawer(open){$('#sidebar').classList.toggle('open',open);$('#menu-button').setAttribute('aria-expanded',String(open));document.body.classList.toggle('drawer-open',open);}
$('#menu-button').onclick=()=>setDrawer(!$('#sidebar').classList.contains('open'));$('#scrim').onclick=()=>setDrawer(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sidebar').classList.contains('open')){setDrawer(false);$('#menu-button').focus();}});
const shell=$('#shell'),side=$('#sidebar'),mobileMq=matchMedia('(max-width:950px)');
const panels={search:{btn:$('#search-btn'),el:$('#panel-search')},state:{btn:$('#state-btn'),el:$('#panel-state')},sections:{btn:$('#sections-btn'),el:$('#menu-wrap')}};
let pinned=null,hover=null,leaveTimer=null;
const isCollapsed=()=>shell.classList.contains('collapsed');
function current(){if(!isCollapsed())return null;if(pinned)return pinned;if(hover)return hover;return Object.keys(panels).find(k=>panels[k].el.contains(document.activeElement))||null;}
function applyFlyout(){const c=current();side.classList.toggle('flyout',!!c);side.dataset.panel=c||'';for(const k in panels)panels[k].btn.setAttribute('aria-expanded',String(k===c));}
function closeFlyout(){pinned=null;hover=null;clearTimeout(leaveTimer);applyFlyout();}
function brandLabel(){const b=$('#collapse-btn'),c=isCollapsed()&&!mobileMq.matches,t=mobileMq.matches?'Close menu':c?'Expand sidebar':'Collapse sidebar';b.setAttribute('aria-expanded',String(!c));b.setAttribute('aria-label',`DSBook: ${t.toLowerCase()}`);b.title=t;}
function setCollapsed(c){shell.classList.toggle('collapsed',c);brandLabel();closeFlyout();}
$('#collapse-btn').onclick=()=>{if(mobileMq.matches)setDrawer(false);else setCollapsed(!isCollapsed());};mobileMq.addEventListener('change',brandLabel);
for(const [k,{btn,el:pel}] of Object.entries(panels)){
btn.onclick=()=>{if(pinned===k)closeFlyout();else{pinned=k;applyFlyout();if(k==='search')$('#menu-search').focus();}};
for(const n of [btn,pel]){n.addEventListener('mouseenter',()=>{clearTimeout(leaveTimer);hover=k;applyFlyout();});n.addEventListener('mouseleave',()=>{clearTimeout(leaveTimer);leaveTimer=setTimeout(()=>{if(hover===k)hover=null;applyFlyout();},250);});}
pel.addEventListener('focusout',()=>setTimeout(applyFlyout,0));}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&side.classList.contains('flyout')){const k=current();closeFlyout();panels[k]?.btn.focus();}});
document.addEventListener('click',e=>{if(pinned&&e.target.isConnected&&!side.contains(e.target))closeFlyout();});
$('#menu').addEventListener('click',e=>{if(e.target.closest('a')){setDrawer(false);closeFlyout();}});

// ---- search, filters, expand/collapse the menu
const setQuery=v=>{query=v.trim().toLocaleLowerCase('en');for(const i of ['#search','#menu-search'])if($(i).value!==v)$(i).value=v;onFilterChange();};
$('#search').oninput=e=>setQuery(e.target.value);$('#menu-search').oninput=e=>setQuery(e.target.value);
$('#filters').onclick=e=>{const b=e.target.closest('button');if(!b)return;const s=b.dataset.status;if(s==='all')filters.clear();else filters.has(s)?filters.delete(s):filters.add(s);onFilterChange();};
$('#panel-state').addEventListener('change',e=>{const s=e.target.dataset.filter;if(!s)return;if(s==='all')filters.clear();else filters.has(s)?filters.delete(s):filters.add(s);onFilterChange();});
$('#expand').onclick=()=>{for(const c of guide.categories)menuOpen.add(c.id);renderMenu(visible());};
$('#collapse').onclick=()=>{menuOpen.clear();if(route.name==='section'||route.name==='category')menuOpen.add(catOf(route.id).id);renderMenu(visible());};

// ---- start
async function init(){try{const results=await Promise.all(['guide','project'].map(async n=>{const r=await fetch(`data/${n}.json`,{cache:'no-store'});if(!r.ok)throw Error(`Could not read ${n}.json`);return r.json();}));[guide,project]=results;validateGuide(guide);validateProject(project,guide);$('#save-status').textContent='Read-only · edited in Claude Design';stats();syncFilters();window.addEventListener('hashchange',go);await go();}catch(e){report(`${e.message}. Start the local server described in README.md; opening index.html with file:// cannot load the JSON files.`);}}
init();
