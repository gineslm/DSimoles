const SLUG=/^[a-z0-9_-]+$/,DATE=/^\d{4}-\d{2}-\d{2}$/,STATUSES=['R','I','P','N'],WHEN=['pending','future'];
const filled=v=>typeof v==='string'&&v.trim().length>0;
export function safePage(page){return typeof page==='string'&&(/^sections\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+(?:\.dc)?\.html$/.test(page)||/^https:\/\/[^\s]+$/i.test(page)&&(()=>{try{const u=new URL(page);return !!u.hostname&&!u.username&&!u.password;}catch{return false;}})());}
// The guide is owned by the project: it is checked against itself, not against a frozen base.
export function validateGuide(g){
  if(!g||g.schemaVersion!==1||!Array.isArray(g.categories)||!g.categories.length)throw Error('Invalid guide');
  const ids=new Set(),paths=new Set(),catIds=new Set(),catNumbers=new Set(),numbers=new Set();
  for(const c of g.categories){
    if(typeof c.id!=='string'||!SLUG.test(c.id)||catIds.has(c.id))throw Error(`Invalid or duplicate category ID: ${c.id}`);catIds.add(c.id);
    if(!filled(String(c.number??''))||catNumbers.has(String(c.number)))throw Error(`Invalid or duplicate category number: ${c.id}`);catNumbers.add(String(c.number));
    for(const f of ['title','objective'])if(!filled(c[f]))throw Error(`Incomplete category: ${c.id}`);
    if(!Array.isArray(c.items))throw Error(`Category without items: ${c.id}`);
    for(const i of c.items){
      const slug=typeof i.id==='string'&&i.id.startsWith(`${c.id}.`)?i.id.slice(c.id.length+1):'';
      if(!SLUG.test(slug))throw Error(`Invalid subsection ID (expected ${c.id}.<slug>): ${i.id}`);
      if(ids.has(i.id))throw Error(`Duplicate subsection ID: ${i.id}`);ids.add(i.id);
      if(!filled(String(i.number??''))||numbers.has(String(i.number)))throw Error(`Invalid or duplicate subsection number: ${i.id}`);numbers.add(String(i.number));
      if(i.suggestedPath!==`sections/${c.id}/${slug}.html`||paths.has(i.suggestedPath))throw Error(`Invalid or duplicate suggested path: ${i.id}`);paths.add(i.suggestedPath);
      for(const f of ['title','objective','define','accessibility','deliverable'])if(!filled(i[f]))throw Error(`Incomplete guide entry: ${i.id}`);
      if(!Array.isArray(i.acceptance)||!i.acceptance.length||!i.acceptance.every(filled))throw Error(`Invalid acceptance criteria: ${i.id}`);
    }
  }
  return true;
}
export function validateProject(p,g){
  if(!p||p.schemaVersion!==2)throw Error('Incompatible project configuration version');
  if(typeof p.projectId!=='string'||!/^[a-z0-9-]+$/.test(p.projectId)||!filled(p.name)||typeof p.language!=='string'||!/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(p.language)||!filled(p.seedVersion))throw Error('Invalid project identity');
  const ids=g.categories.flatMap(c=>c.items.map(i=>i.id));
  if(!p.sections||typeof p.sections!=='object')throw Error('Invalid sections');
  for(const id of ids)if(!p.sections[id])throw Error(`Missing section entry: ${id}`);
  const known=new Set(ids);for(const k of Object.keys(p.sections))if(!known.has(k))throw Error(`Entry without a subsection in the guide: ${k}`);
  for(const id of ids){
    const s=p.sections[id];
    if(!STATUSES.includes(s.status))throw Error(`Invalid status: ${id}`);
    for(const k of ['page','owner','notes','exclusionReason'])if(typeof s[k]!=='string')throw Error(`Invalid field ${k}: ${id}`);
    if(s.page&&!safePage(s.page))throw Error(`Invalid path: ${id}`);
    if(!s.review||['by','date','evidence'].some(k=>typeof s.review[k]!=='string'))throw Error(`Invalid review: ${id}`);
    if(s.review.date&&!DATE.test(s.review.date))throw Error(`Invalid date: ${id}`);
    // Tasks never block Ready: they are validated for shape only and never related to the status.
    if(!Array.isArray(s.tasks)||s.tasks.some(t=>!t||typeof t!=='object'||Object.keys(t).sort().join()!=='text,when'||!filled(t.text)||!WHEN.includes(t.when)))throw Error(`Invalid tasks: ${id}`);
    if(s.status==='R'&&['by','date','evidence'].some(k=>!s.review[k].trim()))throw Error(`Ready requires a review: ${id}`);
    if(s.status==='N'&&!s.exclusionReason.trim())throw Error(`Not applicable requires a reason: ${id}`);
  }
  return true;
}
export function progressOf(p){const s=Object.values(p.sections),applicable=s.filter(i=>i.status!=='N').length,ready=s.filter(i=>i.status==='R').length;return{applicable,ready,total:s.length,percent:applicable?Math.round(ready/applicable*100):null,scope:s.length?Math.round(applicable/s.length*100):null};}
export function pageCandidates(item,section){return section.page?[section.page]:[item.suggestedPath,item.suggestedPath.replace(/\.html$/,'.dc.html')];}
// Routing: hash routes #/ (home), #/<category>, #/<subsection>[/content|guide|record]. Old #item-<id> and #cat-<id> links are translated.
export const VIEWS=['content','info','record'];
export function parseRoute(hash,guide){
  let h=String(hash||'').replace(/^#/,'');
  const legacy=h.match(/^(?:item|cat)-(.+)$/);if(legacy)h=legacy[1];
  try{h=decodeURIComponent(h);}catch{return{name:'notfound',hash:String(hash||'')};}
  const parts=h.replace(/^\/+|\/+$/g,'').split('/');
  if(!parts[0])return{name:'home'};
  const [id,view,...rest]=parts;
  if(rest.length)return{name:'notfound',hash:String(hash||'')};
  if(guide.categories.some(c=>c.id===id))return view?{name:'notfound',hash:String(hash||'')}:{name:'category',id};
  if(guide.categories.some(c=>c.items.some(i=>i.id===id))){if(view&&!VIEWS.includes(view))return{name:'notfound',hash:String(hash||'')};return{name:'section',id,view:view||null};}
  return{name:'notfound',hash:String(hash||'')};
}
export function routeHash(route){return route.name==='home'?'#/':route.name==='category'?`#/${route.id}`:route.name==='section'?`#/${route.id}${route.view?`/${route.view}`:''}`:'#/';}
export function breadcrumb(guide,route,projectName){
  const home={label:projectName,hash:'#/'};
  if(route.name==='home'||route.name==='notfound')return[{label:projectName}];
  const c=route.name==='category'?guide.categories.find(x=>x.id===route.id):guide.categories.find(x=>x.items.some(i=>i.id===route.id));
  const cat={label:`${String(c.number).padStart(2,'0')} ${c.title}`,hash:`#/${c.id}`};
  if(route.name==='category')return[home,{label:cat.label}];
  const i=c.items.find(x=>x.id===route.id);
  return[home,cat,{label:`${i.number} ${i.title}`}];
}
export function neighbors(guide,id){const flat=guide.categories.flatMap(c=>c.items.map(i=>i.id)),k=flat.indexOf(id);return{prev:k>0?flat[k-1]:null,next:k>=0&&k<flat.length-1?flat[k+1]:null};}
// Default view of a section: its page if it has one and it is being worked on or ready; otherwise its guide.
export function defaultView(entry,hasPage){return hasPage&&(entry.status==='I'||entry.status==='R')?'content':'info';}
export function openTasks(entry){return{pending:entry.tasks.filter(t=>t.when==='pending'),future:entry.tasks.filter(t=>t.when==='future')};}
