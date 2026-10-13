const SLUG=/^[a-z0-9_-]+$/,DATE=/^\d{4}-\d{2}-\d{2}$/,STATUSES=['R','I','P','N'],WHEN=['pending','future'];
const filled=v=>typeof v==='string'&&v.trim().length>0;
// Palabras de ruta que ninguna categoría puede usar: la página Framework y las vistas de la home (#/home/<view>).
const RESERVED=['framework','home'];
// Una task es {text, when}. Las tasks de sección y las del proyecto comparten esta forma.
export function validateTasks(tasks){return Array.isArray(tasks)&&tasks.every(t=>t&&typeof t==='object'&&Object.keys(t).sort().join()==='text,when'&&filled(t.text)&&WHEN.includes(t.when));}
export function safePage(page){return typeof page==='string'&&(/^sections\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+(?:\.dc)?\.html$/.test(page)||/^https:\/\/[^\s]+$/i.test(page)&&(()=>{try{const u=new URL(page);return !!u.hostname&&!u.username&&!u.password;}catch{return false;}})());}
// La guía pertenece al proyecto: se valida contra sí misma, no contra una base congelada.
export function validateGuide(g){
  if(!g||g.schemaVersion!==1||!Array.isArray(g.categories)||!g.categories.length)throw Error('Guía no válida');
  const ids=new Set(),paths=new Set(),catIds=new Set(),catNumbers=new Set(),numbers=new Set();
  for(const c of g.categories){
    if(typeof c.id!=='string'||!SLUG.test(c.id)||catIds.has(c.id))throw Error(`ID de categoría no válido o duplicado: ${c.id}`);catIds.add(c.id);
    if(RESERVED.includes(c.id))throw Error(`ID de categoría reservado: ${c.id}`);
    if(!filled(String(c.number??''))||catNumbers.has(String(c.number)))throw Error(`Número de categoría no válido o duplicado: ${c.id}`);catNumbers.add(String(c.number));
    for(const f of ['title','objective'])if(!filled(c[f]))throw Error(`Categoría incompleta: ${c.id}`);
    if(!Array.isArray(c.items))throw Error(`Categoría sin items: ${c.id}`);
    for(const i of c.items){
      const slug=typeof i.id==='string'&&i.id.startsWith(`${c.id}.`)?i.id.slice(c.id.length+1):'';
      if(!SLUG.test(slug))throw Error(`ID de subsección no válido (se esperaba ${c.id}.<slug>): ${i.id}`);
      if(ids.has(i.id))throw Error(`ID de subsección duplicado: ${i.id}`);ids.add(i.id);
      if(!filled(String(i.number??''))||numbers.has(String(i.number)))throw Error(`Número de subsección no válido o duplicado: ${i.id}`);numbers.add(String(i.number));
      if(i.suggestedPath!==`sections/${c.id}/${slug}.html`||paths.has(i.suggestedPath))throw Error(`Ruta sugerida no válida o duplicada: ${i.id}`);paths.add(i.suggestedPath);
      for(const f of ['title','objective','define','accessibility','deliverable'])if(!filled(i[f]))throw Error(`Entrada de la guía incompleta: ${i.id}`);
      if(!Array.isArray(i.acceptance)||!i.acceptance.length||!i.acceptance.every(filled))throw Error(`Criterios de aceptación no válidos: ${i.id}`);
    }
  }
  return true;
}
export function validateProject(p,g){
  if(!p||p.schemaVersion!==2)throw Error('Versión de configuración del proyecto incompatible');
  if(typeof p.projectId!=='string'||!/^[a-z0-9-]+$/.test(p.projectId)||!filled(p.name)||typeof p.language!=='string'||!/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(p.language)||!filled(p.seedVersion))throw Error('Identidad del proyecto no válida');
  const ids=g.categories.flatMap(c=>c.items.map(i=>i.id));
  if(p.repository!==undefined&&!parseRepo(p.repository))throw Error('Repositorio no válido (se esperaba https://github.com/<owner>/<repo>)');
  if(p.record!==undefined){const r=p.record;if(!r||typeof r!=='object'||Object.keys(r).sort().join()!=='notes,owner,tasks'||typeof r.owner!=='string'||typeof r.notes!=='string'||!validateTasks(r.tasks))throw Error('Project record no válido');}
  if(!p.sections||typeof p.sections!=='object')throw Error('Secciones no válidas');
  for(const id of ids)if(!p.sections[id])throw Error(`Falta la entrada de sección: ${id}`);
  const known=new Set(ids);for(const k of Object.keys(p.sections))if(!known.has(k))throw Error(`Entrada sin subsección en la guía: ${k}`);
  for(const id of ids){
    const s=p.sections[id];
    if(!STATUSES.includes(s.status))throw Error(`Estado no válido: ${id}`);
    for(const k of ['page','owner','notes','exclusionReason'])if(typeof s[k]!=='string')throw Error(`Campo ${k} no válido: ${id}`);
    if(s.page&&!safePage(s.page))throw Error(`Ruta no válida: ${id}`);
    if(!s.review||['by','date','evidence'].some(k=>typeof s.review[k]!=='string'))throw Error(`Review no válida: ${id}`);
    if(s.review.date&&!DATE.test(s.review.date))throw Error(`Fecha no válida: ${id}`);
    // Las tasks nunca bloquean Ready: solo se valida su forma y nunca se relacionan con el estado.
    if(!validateTasks(s.tasks))throw Error(`Tasks no válidas: ${id}`);
    if(s.status==='R'&&['by','date','evidence'].some(k=>!s.review[k].trim()))throw Error(`Ready exige una review: ${id}`);
    if(s.status==='N'&&!s.exclusionReason.trim())throw Error(`Not applicable exige un motivo: ${id}`);
    if(s.status==='N'&&s.tasks.length)throw Error(`Una sección Not applicable no puede tener tasks: ${id}. Elimínalas, o reabre la sección (P) si el trabajo le pertenece`);
  }
  return true;
}
export function progressOf(p){const s=Object.values(p.sections),applicable=s.filter(i=>i.status!=='N').length,ready=s.filter(i=>i.status==='R').length;return{applicable,ready,total:s.length,percent:applicable?Math.round(ready/applicable*100):null,scope:s.length?Math.round(applicable/s.length*100):null};}
export function pageCandidates(item,section){return section.page?[section.page]:[item.suggestedPath,item.suggestedPath.replace(/\.html$/,'.dc.html')];}
// Rutas hash: #/ (home), #/<category>, #/<subsection>[/content|info|record]. Los enlaces antiguos #item-<id> y #cat-<id> se traducen.
export const VIEWS=['content','info','record'];
export function parseRoute(hash,guide){
  let h=String(hash||'').replace(/^#/,'');
  const legacy=h.match(/^(?:item|cat)-(.+)$/);if(legacy)h=legacy[1];
  try{h=decodeURIComponent(h);}catch{return{name:'notfound',hash:String(hash||'')};}
  const parts=h.replace(/^\/+|\/+$/g,'').split('/');
  if(!parts[0])return{name:'home'};
  const [id,view,...rest]=parts;
  if(rest.length)return{name:'notfound',hash:String(hash||'')};
  if(id==='framework')return view?{name:'notfound',hash:String(hash||'')}:{name:'framework'};
  if(id==='home'){if(!view)return{name:'home'};return VIEWS.includes(view)?{name:'home',view}:{name:'notfound',hash:String(hash||'')};}
  if(guide.categories.some(c=>c.id===id))return view?{name:'notfound',hash:String(hash||'')}:{name:'category',id};
  if(guide.categories.some(c=>c.items.some(i=>i.id===id))){if(view&&!VIEWS.includes(view))return{name:'notfound',hash:String(hash||'')};return{name:'section',id,view:view||null};}
  return{name:'notfound',hash:String(hash||'')};
}
export function routeHash(route){return route.name==='home'?(route.view?`#/home/${route.view}`:'#/'):route.name==='framework'?'#/framework':route.name==='category'?`#/${route.id}`:route.name==='section'?`#/${route.id}${route.view?`/${route.view}`:''}`:'#/';}
export function breadcrumb(guide,route,projectName){
  const home={label:projectName,hash:'#/'};
  if(route.name==='home'||route.name==='notfound')return[{label:projectName}];
  if(route.name==='framework')return[home,{label:'DSBook framework'}];
  const c=route.name==='category'?guide.categories.find(x=>x.id===route.id):guide.categories.find(x=>x.items.some(i=>i.id===route.id));
  const cat={label:`${String(c.number).padStart(2,'0')} ${c.title}`,hash:`#/${c.id}`};
  if(route.name==='category')return[home,{label:cat.label}];
  const i=c.items.find(x=>x.id===route.id);
  return[home,cat,{label:`${i.number} ${i.title}`}];
}
// Vecinos de una sección en el orden de la guía. Con `allowed` (un Set de IDs, p. ej. las secciones que pasan los filtros) solo cuentan esas, aunque la sección actual no esté entre ellas.
export function neighbors(guide,id,allowed=null){const flat=guide.categories.flatMap(c=>c.items.map(i=>i.id)),k=flat.indexOf(id),ok=i=>!allowed||allowed.has(i);if(k<0)return{prev:null,next:null};const prev=flat.slice(0,k).reverse().find(ok)??null,next=flat.slice(k+1).find(ok)??null;return{prev,next};}
// Vista por defecto de una sección: su página si la tiene y está In process o Ready; si no, su Info.
export function defaultView(entry,hasPage){return hasPage&&(entry.status==='I'||entry.status==='R')?'content':'info';}
// La vista de la home: Content (el resumen) salvo que la dirección diga otra cosa.
export function homeView(route){return route.view||'content';}
// El record propio del proyecto (owner, notes, tasks); un proyecto sin él tiene un record vacío.
export function projectRecord(project){return project.record||{owner:'',notes:'',tasks:[]};}
// Todas las tasks abiertas de todas las secciones, agrupadas por categoría y subsección. Las secciones sin tasks se omiten.
export function collectTasks(guide,project){return guide.categories.map(c=>({category:c,sections:c.items.filter(i=>project.sections[i.id].tasks.length).map(i=>({item:i,...openTasks(project.sections[i.id])}))})).filter(g=>g.sections.length);}
export function openTasks(entry){return{pending:entry.tasks.filter(t=>t.when==='pending'),future:entry.tasks.filter(t=>t.when==='future')};}

// Una copia que aún lleva la identidad del seed no se ha iniciado como proyecto (npm run init).
export function isSeedProject(project,seed){return !!seed&&project.projectId===seed.projectId;}

// ---- estado del framework y del repositorio (puro: el contenedor hace las peticiones)
// URL de un repositorio de GitHub: https://github.com/<owner>/<repo>
export function parseRepo(url){const m=typeof url==='string'&&url.match(/^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_-][A-Za-z0-9_.-]*?)(?:\.git)?\/?$/);return m?{owner:m[1],repo:m[2]}:null;}
export function compareVersions(a,b){const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let k=0;k<3;k++)if(x[k]!==y[k])return x[k]<y[k]?-1:1;return 0;}
// Manifiesto local frente al del origen: el origen es más nuevo ('update'), más antiguo ('ahead'), la misma versión con otros archivos ('diverged') o idéntico ('current').
export function frameworkStatus(local,remote){
  const cmp=compareVersions(local.version,remote.version),names=new Set([...Object.keys(local.files||{}),...Object.keys(remote.files||{})]);
  const differ=[...names].filter(n=>(local.files||{})[n]!==(remote.files||{})[n]).sort();
  return{state:cmp<0?'update':cmp>0?'ahead':differ.length?'diverged':'current',differ,local:local.version,remote:remote.version};
}
// El commit en que está un clon local, a partir del texto de .git/HEAD, del archivo al que apunta y de .git/packed-refs.
export function shaFromGit(head,refFile,packed){
  const h=String(head||'').trim();if(/^[0-9a-f]{40}$/.test(h))return h;
  const ref=h.match(/^ref: (\S+)$/)?.[1];if(!ref)return null;
  const direct=String(refFile||'').trim();if(/^[0-9a-f]{40}$/.test(direct))return direct;
  const line=String(packed||'').split(/\r?\n/).find(l=>l.endsWith(` ${ref}`)&&/^[0-9a-f]{40} /.test(l));return line?line.slice(0,40):null;
}
// Comparación de GitHub de <local>...<remote>: null significa que el commit local no está en GitHub.
export function commitState(cmp){
  if(!cmp)return{state:'unpushed'};
  if(cmp.status==='identical')return{state:'current'};
  if(cmp.status==='ahead')return{state:'update',count:cmp.ahead_by};
  if(cmp.status==='behind')return{state:'unpushed',count:cmp.behind_by};
  return{state:'diverged'};
}
