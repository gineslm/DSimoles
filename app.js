import {validateGuide, validateProject, progressOf, pageCandidates, parseRoute, routeHash, breadcrumb, neighbors, defaultView, openTasks, homeView, projectRecord, collectTasks, parseRepo, frameworkStatus, shaFromGit, commitState, isSeedProject} from './model.js';
const $=s=>document.querySelector(s), labels={R:'Ready',I:'In process',P:'Pending',N:'Not applicable'};
let guide,project,manifest=null,seed=null,route={name:'home'},routeToken=0,filters=new Set(),query='',found=new Map(),resolved=new Map(),navigated=false;
const el=(tag,props={},text)=>{const node=document.createElement(tag);Object.assign(node,props);if(text!==undefined)node.textContent=text;return node;};
const link=(href,text,props={})=>el('a',{href,...props},text);
function report(message){$('#error').textContent=message;$('#error').hidden=false;}

// ---- data helpers
const itemOf=id=>{for(const c of guide.categories){const i=c.items.find(x=>x.id===id);if(i)return i;}};
const catOf=id=>guide.categories.find(c=>c.id===id||c.items.some(i=>i.id===id));
const statusTag=s=>{const t=el('span',{className:'status-tag'},`${s} · ${labels[s]}`);t.dataset.value=s;return t;};
function pageExists(path){if(!found.has(path))found.set(path,fetch(path,{method:'HEAD',cache:'no-store'}).then(r=>r.ok&&/text\/html/i.test(r.headers.get('content-type')||'')).catch(()=>false));return found.get(path);}
function resolvePage(i,p){if(!resolved.has(i.id)){const c=pageCandidates(i,p);resolved.set(i.id,p.page?Promise.resolve(p.page):Promise.all(c.map(pageExists)).then(r=>{const k=r.indexOf(true);return k>=0?c[k]:null;}));}return resolved.get(i.id);}
function visible(){return guide.categories.map(c=>({c,items:c.items.filter(i=>(!filters.size||filters.has(project.sections[i.id].status))&&`${i.number} ${i.title} ${i.define} ${c.title}`.toLocaleLowerCase('es').includes(query))})).filter(v=>v.items.length);}

// ---- rail: status filter and sections menu
function stats(){const counts={R:0,I:0,P:0,N:0};Object.values(project.sections).forEach(s=>counts[s.status]++);document.querySelectorAll('[data-count]').forEach(n=>n.textContent=counts[n.dataset.count]);}
function syncFilters(){document.querySelectorAll('[data-filter]').forEach(c=>{c.checked=c.dataset.filter==='all'?!filters.size:filters.has(c.dataset.filter);});$('#state-btn').dataset.active=String(filters.size>0||!!query);}
// Wide screens use the cascade; hovering is detected from pointer events (a mouse or a pen), not from media queries.
const wide=matchMedia('(min-width:951px)');
let closeTimer=null;
function openCat(cat){clearTimeout(closeTimer);document.querySelectorAll('.menu-cat.open').forEach(x=>{if(x!==cat)x.classList.remove('open');});cat.classList.add('open');
  const sub=cat.querySelector('.submenu');if(wide.matches&&sub){const wrap=$('#menu-wrap').getBoundingClientRect(),row=cat.getBoundingClientRect();sub.style.left=`${wrap.right}px`;sub.style.top=`${Math.max(8,Math.min(row.top,innerHeight-sub.offsetHeight-8))}px`;}}
function closeCat(cat){closeTimer=setTimeout(()=>{if(!cat.matches(':hover,:focus-within'))cat.classList.remove('open');},140);}
function renderMenu(view){const menu=$('#menu'),top=menu.scrollTop,focusKey=document.activeElement&&menu.contains(document.activeElement)?document.activeElement.dataset.key:null;menu.replaceChildren();
for(const {c,items} of view){const within=(route.name==='category'||route.name==='section')&&catOf(route.id).id===c.id,cat=el('div',{className:'menu-cat'}),row=el('div',{className:'menu-cat-row'});if(within)cat.dataset.current='true';
const a=link(`#/${c.id}`,'',{className:'menu-cat-link'});a.dataset.key=`c-${c.id}`;a.setAttribute('aria-haspopup','true');a.append(el('span',{className:'menu-num'},String(c.number).padStart(2,'0')),el('span',{},c.title));if(route.name==='category'&&route.id===c.id)a.setAttribute('aria-current','page');
const chev=el('button',{className:'menu-chevron',type:'button'});chev.setAttribute('aria-label',`${c.title}: mostrar subsecciones`);chev.onclick=()=>{if(cat.classList.contains('open'))cat.classList.remove('open');else openCat(cat);};
row.append(a,chev);const list=el('ul',{className:'submenu',id:`menu-${c.id}`});list.setAttribute('aria-label',`Subsecciones de ${c.title}`);
for(const i of items){const p=project.sections[i.id],li=el('li'),x=link(`#/${i.id}`,'',{className:'menu-item'});x.dataset.key=`i-${i.id}`;x.append(el('span',{className:'menu-num'},i.number),el('span',{className:'menu-title'},i.title));const b=el('span',{className:'menu-status'},p.status);b.dataset.value=p.status;b.append(el('span',{className:'sr-only'},` · ${labels[p.status]}`));x.append(b);if(route.name==='section'&&route.id===i.id)x.setAttribute('aria-current','page');li.append(x);list.append(li);}
cat.append(row,list);
cat.addEventListener('pointerenter',e=>{if(wide.matches&&e.pointerType!=='touch')openCat(cat);});cat.addEventListener('pointerleave',e=>{if(wide.matches&&e.pointerType!=='touch')closeCat(cat);});
cat.addEventListener('focusin',()=>{if(wide.matches)openCat(cat);});cat.addEventListener('focusout',()=>{if(wide.matches)closeCat(cat);});
menu.append(cat);}
menu.scrollTop=top;if(focusKey)menu.querySelector(`[data-key="${CSS.escape(focusKey)}"]`)?.focus({preventScroll:true});}
function onFilterChange(){syncFilters();renderMenu(visible());if(route.name==='home'||route.name==='category')renderRoute(routeToken);else if(route.name==='section')renderPager(itemOf(route.id));}

// ---- header: breadcrumb, status, views, pager
function renderHead(item,entry,page,effective){
  const crumbs=$('#crumbs');crumbs.replaceChildren();
  breadcrumb(guide,route,project.name).forEach((c,k,all)=>{const li=el('li');if(c.hash&&k<all.length-1)li.append(link(c.hash,c.label));else{const s=el('span',{},c.label);s.setAttribute('aria-current','page');li.append(s);}crumbs.append(li);});
  const section=route.name==='section',home=route.name==='home',views=$('#views'),status=$('#head-status'),pager=$('#pager');
  views.hidden=$('#sep-views').hidden=!(section||home);status.hidden=pager.hidden=$('#sep-pager').hidden=!section;
  if(!section&&!home)return;
  const root=section?`#/${item.id}`:'#/home',current=section?effective:homeView(route);
  views.replaceChildren(...[['content','Content'],['info','Info'],['record','Record']].map(([v,t])=>{const a=link(home&&v==='content'?'#/':`${root}/${v}`,t);if(v===current)a.setAttribute('aria-current','page');return a;}));
  if(!section)return;
  status.textContent=`${entry.status} · ${labels[entry.status]}`;status.dataset.value=entry.status;
  renderPager(item);
}
// Anterior / Siguiente se mueven entre las secciones que pasan los filtros y la búsqueda
function renderPager(item){
  const shown=new Set(visible().flatMap(v=>v.items.map(i=>i.id))),n=neighbors(guide,item.id,filters.size||query?shown:null);
  $('#pager').replaceChildren(...[['prev','‹','Anterior'],['next','›','Siguiente']].map(([k,glyph,word])=>{const id=n[k];if(!id){const s=el('span',{className:'pager-btn'},glyph);s.setAttribute('aria-disabled','true');s.setAttribute('aria-label',`${word}: no hay sección`);return s;}return link(`#/${id}`,glyph,{className:'pager-btn',title:`${word}: ${itemOf(id).title}`,ariaLabel:`${word}: sección ${itemOf(id).title}`});}));
}

// ---- views
function viewHome(){const v=homeView(route);return v==='info'?viewHomeInfo():v==='record'?viewHomeRecord():viewSummary();}
// Vista de la home: tarjetas por categoría o lista con todas las subsecciones. Es estado de visualización en memoria.
let homeLayout='list';const collapsedCats=new Set();
const ICONS={cards:'<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  list:'<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M9 6h11M9 12h11M9 18h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.4" fill="currentColor"/><circle cx="4.5" cy="12" r="1.4" fill="currentColor"/><circle cx="4.5" cy="18" r="1.4" fill="currentColor"/></svg>'};
const countsOf=c=>{const counts={R:0,I:0,P:0,N:0};c.items.forEach(i=>counts[project.sections[i.id].status]++);return counts;};
function summaryCards(){
  const cards=el('div',{className:'cards'});
  for(const {c} of visible()){const counts=countsOf(c),applicable=c.items.length-counts.N,card=link(`#/${c.id}`,'',{className:'card'});
    const bar=el('progress',{max:100,value:applicable?Math.round(counts.R/applicable*100):0});bar.setAttribute('aria-label',`${c.title}: ${counts.R} de ${applicable} subsecciones aplicables en Ready`);
    card.append(el('span',{className:'card-num'},String(c.number).padStart(2,'0')),el('span',{className:'card-title'},c.title),el('span',{className:'card-text'},c.objective),bar,el('span',{className:'card-counts'},Object.keys(labels).map(s=>`${s} ${counts[s]}`).join(' · ')));cards.append(card);}
  if(!cards.childNodes.length)cards.append(el('p',{className:'no-results'},'Ninguna categoría coincide con estos filtros. Prueba con otro estado u otra búsqueda.'));
  return cards;
}
function summaryList(onChange){
  const tree=el('div',{className:'tree'}),shown=visible();
  for(const {c,items} of shown){
    const counts=countsOf(c),open=!collapsedCats.has(c.id),cat=el('section',{className:'tree-cat'}),head=el('div',{className:'tree-head'});
    const chev=el('button',{type:'button',className:'tree-toggle'});chev.setAttribute('aria-expanded',String(open));chev.setAttribute('aria-controls',`tree-${c.id}`);chev.setAttribute('aria-label',`${c.title}: ${open?'contraer':'expandir'}`);chev.append(el('span',{className:'tree-chevron','aria-hidden':'true'}));
    const h=el('h2',{className:'tree-title'});h.append(el('span',{className:'tree-num'},String(c.number).padStart(2,'0')),link(`#/${c.id}`,c.title));
    head.append(chev,h,el('span',{className:'tree-counts'},Object.keys(labels).map(s=>`${s} ${counts[s]}`).join(' · ')));
    const list=el('ul',{className:'rows tree-rows',id:`tree-${c.id}`});list.hidden=!open;
    for(const i of items){const li=el('li'),a=link(`#/${i.id}`,'',{className:'row'});a.append(el('span',{className:'row-num'},i.number),el('span',{className:'row-title'},i.title),statusTag(project.sections[i.id].status));li.append(a);list.append(li);}
    chev.onclick=()=>{const now=list.hidden;list.hidden=!now;if(now)collapsedCats.delete(c.id);else collapsedCats.add(c.id);chev.setAttribute('aria-expanded',String(now));chev.setAttribute('aria-label',`${c.title}: ${now?'contraer':'expandir'}`);onChange?.();};
    cat.append(head,list);tree.append(cat);
  }
  if(!shown.length)tree.append(el('p',{className:'no-results'},'Ninguna categoría coincide con estos filtros. Prueba con otro estado u otra búsqueda.'));
  return tree;
}
function layoutControls(holder){
  const box=el('div',{className:'lead-tools'}),all=el('button',{type:'button',className:'tree-all'},'Contraer todo'),seg=el('div',{className:'seg',role:'group'});
  seg.setAttribute('aria-label','Vista de la home');
  const buttons={};
  const sync=()=>{for(const k in buttons)buttons[k].setAttribute('aria-pressed',String(k===homeLayout));all.hidden=homeLayout!=='list';all.textContent=collapsedCats.size?'Expandir todo':'Contraer todo';};
  const fill=()=>holder.replaceChildren(homeLayout==='list'?summaryList(sync):summaryCards());
  for(const [k,text] of [['cards','Tarjetas'],['list','Lista']]){
    const b=el('button',{type:'button',className:'seg-btn'});b.innerHTML=ICONS[k];b.append(text);buttons[k]=b;
    b.onclick=()=>{if(homeLayout===k)return;homeLayout=k;fill();sync();};seg.append(b);
  }
  all.onclick=()=>{if(collapsedCats.size)collapsedCats.clear();else visible().forEach(({c})=>collapsedCats.add(c.id));fill();sync();};
  sync();box.append(all,seg);fill();return box;
}
function viewSummary(){
  const wrap=el('div',{className:'view-inner'}),total=guide.categories.reduce((n,c)=>n+c.items.length,0),p=progressOf(project),holder=el('div',{className:'home-body'});
  wrap.append(el('h1',{id:'view-title'},project.name));
  const bar=el('div',{className:'lead-row'});bar.append(el('p',{className:'lead'},`${total} subsecciones en ${guide.categories.length} categorías.`),layoutControls(holder));wrap.append(bar);
  const meter=(title,value,text)=>{const m=el('div',{className:'meter'}),h=el('div',{className:'meter-head'});h.append(el('span',{},title),el('span',{},text));const bar=el('progress',{max:100,value:value||0});bar.setAttribute('aria-label',`${title}: ${text}`);m.append(h,bar);return m;};
  const meters=el('div',{className:'meters'});meters.append(meter('Progress',p.percent,p.applicable?`${p.ready} de ${p.applicable} aplicables en Ready`:'Sin secciones aplicables'),meter('Complexity',p.scope,`${p.applicable} de ${p.total} no son N`));wrap.append(meters);
  wrap.append(holder);
  const foot=el('p',{className:'muted small'});foot.append('Solo lectura: todo se edita en Claude Design. ',link('README.md','README'),' · ',link('CLAUDE.md','Guía para agentes'));wrap.append(foot);return wrap;
}
function viewCategory(c){
  const wrap=el('div',{className:'view-inner'}),items=visible().find(v=>v.c.id===c.id)?.items||[];
  wrap.append(el('h1',{id:'view-title'},`${String(c.number).padStart(2,'0')} ${c.title}`),el('p',{className:'lead'},c.objective));
  const list=el('ul',{className:'rows'});
  for(const i of items){const li=el('li'),a=link(`#/${i.id}`,'',{className:'row'});a.append(el('span',{className:'row-num'},i.number),el('span',{className:'row-title'},i.title),statusTag(project.sections[i.id].status));li.append(a);list.append(li);}
  wrap.append(list);if(!items.length)wrap.append(el('p',{className:'no-results'},'Ninguna subsección coincide con estos filtros. Prueba con otro estado u otra búsqueda.'));
  wrap.append(el('p',{className:'muted small'},`${items.length} de ${c.items.length} subsecciones mostradas.`));return wrap;
}
function viewInfo(i){
  const wrap=el('div',{className:'view-inner'});wrap.append(el('h1',{id:'view-title'},i.title));
  const grid=el('div',{className:'guide-grid'});
  for(const [title,value] of [['Objetivo',i.objective],['Qué definir',i.define],['Accesibilidad',i.accessibility],['Entregable esperado',i.deliverable]]){const box=el('div');box.append(el('h2',{},title),el('p',{},value));grid.append(box);}
  const box=el('div',{className:'wide'}),ul=el('ul');box.append(el('h2',{},'Criterios de aceptación'));for(const t of i.acceptance)ul.append(el('li',{},t));box.append(ul);grid.append(box);wrap.append(grid);return wrap;
}
// The one task list: pending and future tasks of a section or of the project. Tasks never block Ready.
function tasksList(t,{note=true,level='h3'}={}){
  const tasks=el('div',{className:'tasks'});
  for(const [title,list] of [['Pending',t.pending],['Future',t.future]]){if(!list.length)continue;tasks.append(el(level,{},title));const ul=el('ul');list.forEach(x=>ul.append(el('li',{},x.text)));tasks.append(ul);}
  if(!tasks.childNodes.length)tasks.append(el('p',{className:'muted'},'Sin tasks.'));else if(note)tasks.append(el('p',{className:'muted small'},'Las tasks nunca bloquean Ready.'));
  return tasks;
}
// Home page, Info view: reserved for a guide to the project and the framework; no content yet.
function viewHomeInfo(){
  const wrap=el('div',{className:'view-inner'}),empty=el('div',{className:'empty'});
  wrap.append(el('h1',{id:'view-title'},project.name));
  empty.append(el('h2',{},'Aún no hay información'),el('p',{},'Esta vista está reservada para una guía del proyecto y del framework. Todavía no tiene contenido.'));
  wrap.append(empty);return wrap;
}
// Home page, Record view: the project record, then the tasks of every section (read-only: each one is edited in its own section).
function viewHomeRecord(){
  const wrap=el('div',{className:'view-inner'}),r=projectRecord(project),rec=el('div',{className:'record'});
  wrap.append(el('h1',{id:'view-title'},project.name));
  const field=(title,node,wide)=>{const box=el('div',wide?{className:'wide'}:{});box.append(el('h2',{},title),node);rec.append(box);};
  const text=v=>el('p',{className:v?'':'muted'},v||'Sin registrar');
  field('Owner',text(r.owner));field('Notes',text(r.notes),true);field('Project tasks',tasksList(openTasks(r),{note:false}),true);
  wrap.append(rec);
  const sec=el('div',{className:'section-tasks'}),groups=collectTasks(guide,project);
  sec.append(el('h2',{},'Section tasks'),el('p',{className:'muted small'},'Solo lectura: cada task se edita en el Record de su sección. Las tasks nunca bloquean Ready.'));
  if(!groups.length)sec.append(el('p',{className:'muted'},'Ninguna sección tiene tasks.'));
  for(const g of groups){
    const cat=el('div',{className:'task-group'}),h=el('h3',{});h.append(link(`#/${g.category.id}`,`${String(g.category.number).padStart(2,'0')} ${g.category.title}`));cat.append(h);
    for(const s of g.sections){const row=el('div',{className:'task-section'}),title=el('p',{className:'task-section-title'});title.append(link(`#/${s.item.id}/record`,`${s.item.number} ${s.item.title}`),statusTag(project.sections[s.item.id].status));row.append(title,tasksList(s,{note:false,level:'h4'}));cat.append(row);}
    sec.append(cat);
  }
  wrap.append(sec);return wrap;
}
function viewRecord(i,p,page){
  const wrap=el('div',{className:'view-inner'});wrap.append(el('h1',{id:'view-title'},i.title));
  const rec=el('div',{className:'record'}),field=(title,node,wide)=>{const box=el('div',wide?{className:'wide'}:{});box.append(el('h2',{},title));box.append(node);rec.append(box);};
  const text=v=>el('p',{className:v?'':'muted'},v||'Sin registrar');
  field('Status',(()=>{const d=el('div',{className:'status-line'});d.append(statusTag(p.status),el('span',{className:'muted small'},'Solo lectura: el estado se cambia en Claude Design.'));return d;})());
  field('Owner',text(p.owner));
  field('Page',text(page||`Sin página · se espera en ${i.suggestedPath}`));
  field('Decisiones y notes',text(p.notes),true);
  field('Tasks',tasksList(openTasks(p)),true);
  if(p.status==='N')field('Exclusion reason',text(p.exclusionReason),true);
  field('Review · name',text(p.review.by));field('Review · date',text(p.review.date));field('Review · evidence',text(p.review.evidence),true);
  wrap.append(rec);return wrap;
}
function viewContent(i,page){
  if(page){const f=el('iframe',{src:page,title:`Página de ${i.title}`,referrerPolicy:'no-referrer'});f.setAttribute('sandbox','allow-scripts');return f;}
  const wrap=el('div',{className:'view-inner'});wrap.append(el('h1',{id:'view-title'},i.title));
  const empty=el('div',{className:'empty'});empty.append(el('h2',{},'Aún no hay página'),el('p',{},'Esta sección no tiene página en la ruta esperada:'),el('code',{},i.suggestedPath),link(`#/${i.id}/info`,'Leer la Info'));wrap.append(empty);return wrap;
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
    btn.onclick=async()=>{btn.disabled=true;status.textContent='Comprobando…';try{status.textContent=await checkFn();}catch(e){status.textContent=`No se pudo comprobar: ${e.message}. Necesita conexión, y los repositorios privados no se pueden leer desde el navegador.`;}finally{btn.disabled=false;}};
    actions.append(btn,status);}
  else actions.append(el('p',{className:'about-status'},hint));
  block.append(actions);return block;
}
function viewFramework(){
  const wrap=el('div',{className:'view-inner'}),cols=el('div',{className:'about-cols'}),text=el('div',{className:'about-text'}),about=el('div',{className:'about'});
  for(const [title,body] of [['Qué es','DSBook es una herramienta que guía el desarrollo de un Design System y su evolución en el tiempo. Lista lo que un sistema completo debería definir, da a cada subsección una página y un record, y muestra de un vistazo qué está Ready, In process, Pending o Not applicable.'],['Cómo funciona','Este sitio solo muestra el estado del proyecto: el trabajo no se hace aquí. El diseño ocurre en Claude Design, que escribe las páginas, las notes y los estados. Claude Code los trae al repositorio, ejecuta las comprobaciones y hace los commits. Un repositorio de GitHub es la fuente de verdad que mantiene a ambos sincronizados. Para trabajar, elige una subsección en el menú Sections, lee lo que pide, desarróllala en Claude Design y deja que los agentes la integren.']]){const s=el('section');s.append(el('h2',{},title),el('p',{},body));text.append(s);}
  wrap.append(el('h1',{id:'view-title'},'DSBook framework'));
  const m=manifest,src=m&&parseRepo(m.repository),ext=url=>link(url,url.replace('https://',''),{target:'_blank',rel:'noopener noreferrer'});
  about.append(aboutBlock('DSBook framework',
    m?[['Version',m.version],['Released',m.released||'Sin registrar'],['Source',src?ext(m.repository):'Sin registrar']]:[['Version','No se encontró dsbook.json']],
    src&&m?async()=>{
      const remote=await getJson(`https://raw.githubusercontent.com/${src.owner}/${src.repo}/HEAD/dsbook.json`),s=frameworkStatus(m,remote),n=s.differ.length;
      if(s.state==='current')return `Al día: DSBook ${s.local}.`;
      if(s.state==='update')return `Hay una actualización: ${s.local} → ${s.remote}${remote.released?` (publicada el ${remote.released})`:''}. ${n} ${n===1?'archivo del framework difiere':'archivos del framework difieren'}.`;
      if(s.state==='ahead')return `Este proyecto va por delante de su origen (${s.local} aquí, ${s.remote} allí). El cambio aún debe portarse a DSBook.`;
      return `Misma versión (${s.local}) pero ${n} ${n===1?'archivo del framework difiere':'archivos del framework difieren'}: ${s.differ.join(', ')}.`;
    }:null,'El repositorio de origen no está registrado en dsbook.json.'));
  const uninit=isSeedProject(project,seed),repo=parseRepo(project.repository),last=el('span',{},'Se muestra tras comprobar');
  if(uninit)about.append(el('p',{className:'about-status'},'Esta copia aún no se ha iniciado como proyecto. Ejecuta npm run init -- --id <id> --name "<name>" (ver docs/template.md).'));
  else about.append(aboutBlock('This project',
    [['Project',project.name],['Repository',repo?ext(project.repository):'Sin definir'],['Last commit',last]],
    repo?async()=>{
      const api=`https://api.github.com/repos/${repo.owner}/${repo.repo}`,top=await getJson(`${api}/commits/HEAD`);
      last.textContent=`${top.commit.message.split('\n')[0]} · ${top.sha.slice(0,7)} · ${top.commit.author.date.slice(0,10)}`;
      const local=await readLocalCommit();
      if(!local)return 'No se pudo leer el commit de tu copia, así que no se puede comparar. Sirve el sitio desde la carpeta del repositorio.';
      let cmp=null;try{cmp=await getJson(`${api}/compare/${local}...${top.sha}`);}catch(e){if(e.message!=='HTTP 404')throw e;}
      const r=commitState(cmp),c=r.count;
      if(r.state==='current')return 'Al día con GitHub.';
      if(r.state==='update')return `GitHub tiene ${c} ${c===1?'commit más reciente':'commits más recientes'} que esta copia. Haz pull antes de trabajar.`;
      if(r.state==='unpushed')return `Esta copia tiene commits que no están en GitHub${c?` (${c})`:''}.`;
      return 'Esta copia y GitHub han divergido: cada uno tiene commits que el otro no tiene.';
    }:null,'Define "repository" en data/project.json para comprobar el repositorio del proyecto.'));
  cols.append(text,about);wrap.append(cols);return wrap;
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
  else if(route.name==='framework'){node=viewFramework();title='DSBook framework';}
  else if(route.name==='home')node=viewHome();
  else{node=el('div',{className:'view-inner'});node.append(el('h1',{id:'view-title'},'Página no encontrada'),el('p',{},`No hay nada en ${route.hash||'esta dirección'}.`),link('#/','Ir a la home'));}
  renderHead(item,entry,page,effective);
  if(node.tagName==='IFRAME'){view.setAttribute('aria-label',`Página de ${title}`);view.removeAttribute('aria-labelledby');view.replaceChildren(node);}else{view.setAttribute('aria-labelledby','view-title');view.replaceChildren(node);}
  const plain=route.name==='home'&&homeView(route)==='content';if(route.name==='home'&&!plain)title=homeView(route)==='info'?'Info':'Record';
  document.title=plain?`DSBook · ${name}`:`${title} · DSBook · ${name}`;
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
for(const n of [btn,pel]){n.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;clearTimeout(leaveTimer);hover=k;applyFlyout();});n.addEventListener('pointerleave',e=>{if(e.pointerType==='touch')return;clearTimeout(leaveTimer);leaveTimer=setTimeout(()=>{if(hover===k)hover=null;applyFlyout();},250);});}
pel.addEventListener('focusout',()=>setTimeout(applyFlyout,0));}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&side.dataset.panel){const k=current();closeFlyout();panels[k]?.btn.focus();}});
document.addEventListener('click',e=>{if(pinned&&e.target.isConnected&&!side.contains(e.target))closeFlyout();});
$('#menu').addEventListener('click',e=>{if(e.target.closest('a'))closeFlyout();});

// ---- search (header) and status filters (rail)
const setQuery=v=>{query=v.trim().toLocaleLowerCase('es');if($('#search').value!==v)$('#search').value=v;onFilterChange();};
function searchOpen(open,focus){const box=$('#head-search'),input=$('#search');box.classList.toggle('open',open);input.hidden=!open;$('#search-toggle').setAttribute('aria-expanded',String(open));if(open&&focus)input.focus();}
$('#search-toggle').onclick=()=>{const open=!$('#head-search').classList.contains('open');if(!open&&$('#search').value){setQuery('');}searchOpen(open,true);};
$('#search').onkeydown=e=>{if(e.key==='Escape'){e.stopPropagation();setQuery('');searchOpen(false);$('#search-toggle').focus();}};
$('#search').onblur=()=>{if(!$('#search').value)searchOpen(false);};
$('#search').oninput=e=>setQuery(e.target.value);
$('#panel-state').addEventListener('change',e=>{const s=e.target.dataset.filter;if(!s)return;if(s==='all')filters.clear();else filters.has(s)?filters.delete(s):filters.add(s);onFilterChange();});

// ---- start
async function init(){try{const results=await Promise.all(['guide','project'].map(async n=>{const r=await fetch(`data/${n}.json`,{cache:'no-store'});if(!r.ok)throw Error(`No se pudo leer ${n}.json`);return r.json();}));[guide,project]=results;manifest=await fetch('dsbook.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);seed=await fetch('seed/project.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);validateGuide(guide);validateProject(project,guide);stats();syncFilters();window.addEventListener('hashchange',go);await go();}catch(e){report(`${e.message}. Arranca el servidor local que describe README.md; abrir index.html con file:// no puede cargar los archivos JSON.`);}}
init();
