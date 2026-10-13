import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {validateGuide,validateProject,safePage,progressOf,pageCandidates,parseRoute,routeHash,breadcrumb,neighbors,defaultView,openTasks} from '../model.js';
const guide=JSON.parse(await readFile(new URL('../seed/guide.json',import.meta.url))),base=JSON.parse(await readFile(new URL('../seed/project.json',import.meta.url)));const copy=()=>structuredClone(base),id=guide.categories[0].items[0].id;
test('Plantilla completa y en Pending',()=>{assert.equal(validateProject(base,guide),true);assert.equal(progressOf(base).percent,0);});
test('Not applicable queda excluido de Progress; todo N no divide por cero',()=>{const p=copy();for(const s of Object.values(p.sections)){s.status='N';s.exclusionReason='Out of scope';s.tasks=[];}assert.equal(progressOf(p).percent,null);assert.equal(progressOf(p).scope,0);const s=p.sections[id];s.status='R';s.review={by:'Reviewer',date:'2026-10-08',evidence:'Tests recorded'};assert.equal(progressOf(p).percent,100);validateProject(p,guide);});
test('Rechaza importaciones incompletas y estados desconocidos',()=>{const p=copy();delete p.sections[id];assert.throws(()=>validateProject(p,guide));const q=copy();q.sections[id].status='A';assert.throws(()=>validateProject(q,guide));});
test('Ready y N exigen evidencia explícita',()=>{for(const state of ['R','N']){const p=copy();p.sections[id].status=state;assert.throws(()=>validateProject(p,guide));}});
test('Las URLs y rutas no pueden ejecutar código ni salir del repo',()=>{for(const s of ['javascript:alert(1)','data:text/html,test','../index.html','sections/../../index.html','https://user:password@example.com','file:///tmp/test.html','http://example.com'])assert.equal(safePage(s),false,s);for(const s of ['sections/visuals/color.html','sections/visuals/color.dc.html','https://example.com/design'])assert.equal(safePage(s),true,s);});
test('Rechaza versiones divergentes e IDs sustituidos',()=>{const p=copy();p.schemaVersion=1;assert.throws(()=>validateProject(p,guide));const q=copy();q.sections.fake=q.sections[id];delete q.sections[id];assert.throws(()=>validateProject(q,guide));});
test('Sin page, la página es la ruta sugerida en ambas variantes; con page, solo esa',()=>{const item=guide.categories[0].items[0],s=copy().sections[id];assert.deepEqual(pageCandidates(item,s),[item.suggestedPath,item.suggestedPath.replace(/\.html$/,'.dc.html')]);s.page='https://example.com/design';assert.deepEqual(pageCandidates(item,s),['https://example.com/design']);});
test('Progress sobre las secciones aplicables y Complexity sobre el total',()=>{const p=copy(),ids=Object.keys(p.sections);for(const k of ids){p.sections[k].status='P';p.sections[k].exclusionReason='';}assert.equal(progressOf(p).scope,100);assert.equal(progressOf(p).total,ids.length);for(const k of ids.slice(0,ids.length/2)){p.sections[k].status='N';p.sections[k].exclusionReason='Out of scope';}const r=progressOf(p);assert.equal(r.applicable,ids.length/2);assert.equal(r.scope,50);assert.equal(r.percent,0);});
const gcopy=()=>structuredClone(guide);
test('La guía es válida y se valida por sí sola',()=>{assert.equal(validateGuide(guide),true);});
test('Guía: rechaza IDs duplicados, IDs fuera de su categoría y rutas erróneas',()=>{
  const a=gcopy();a.categories[0].items[1].id=a.categories[0].items[0].id;assert.throws(()=>validateGuide(a),/duplicado|no válido/);
  const b=gcopy();b.categories[0].items[0].id='visuals.something';assert.throws(()=>validateGuide(b),/se esperaba/);
  const c=gcopy();c.categories[0].items[0].suggestedPath='sections/other/x.html';assert.throws(()=>validateGuide(c),/Ruta sugerida/);
  const d=gcopy();d.categories[0].items[1].number=d.categories[0].items[0].number;assert.throws(()=>validateGuide(d),/Número/);
  const e=gcopy();e.categories[0].items[0].objective=' ';assert.throws(()=>validateGuide(e),/incompleta/);
});
test('Un proyecto puede añadir una categoría y una subsección cuando guía y proyecto coinciden',()=>{
  const g=gcopy(),p=copy();
  g.categories.push({id:'extra',number:'14',title:'Extra',objective:'Extra objective.',items:[{id:'extra.new-thing',number:'14.1',title:'New thing',objective:'o',define:'d',accessibility:'a',deliverable:'x',acceptance:['ok'],suggestedPath:'sections/extra/new-thing.html'}]});
  assert.equal(validateGuide(g),true);
  assert.throws(()=>validateProject(p,g),/Falta la entrada de sección/);
  p.sections['extra.new-thing']={status:'P',page:'',owner:'',notes:'',tasks:[],review:{by:'',date:'',evidence:''},exclusionReason:''};
  assert.equal(validateProject(p,g),true);
  assert.equal(progressOf(p).total,133);
});
test('Se rechazan las entradas sin subsección en la guía',()=>{const p=copy();p.sections['visuals.ghost']=structuredClone(p.sections[id]);assert.throws(()=>validateProject(p,guide),/sin subsección/);});
test('Tasks: las formas válidas pasan; se rechazan el tipo erróneo, las claves de más y el texto vacío',()=>{
  const p=copy();p.sections[id].tasks=[{text:'Define the dark theme',when:'future'},{text:'Approve values',when:'pending'}];assert.equal(validateProject(p,guide),true);
  for(const bad of [[{text:'x',when:'soon'}],[{text:'  ',when:'pending'}],[{text:'x',when:'pending',done:true}],['x'],{}]){const q=copy();q.sections[id].tasks=bad;assert.throws(()=>validateProject(q,guide),/Tasks no válidas/);}
  const q=copy();delete q.sections[id].tasks;assert.throws(()=>validateProject(q,guide),/Tasks no válidas/);
});
test('Las tasks nunca bloquean Ready y no cuentan en Progress',()=>{
  const p=copy(),s=p.sections[id];s.status='R';s.review={by:'Reviewer',date:'2026-10-09',evidence:'Checked'};
  s.tasks=[{text:'Define the dark theme',when:'future'},{text:'Approve values',when:'pending'}];
  assert.equal(validateProject(p,guide),true);
  assert.equal(progressOf(p).ready,1);
  assert.deepEqual(Object.keys(progressOf(p)).sort(),['applicable','percent','ready','scope','total']);
});
test('La identidad del proyecto exige language y la versión del seed',()=>{for(const k of ['language','seedVersion']){const p=copy();p[k]='';assert.throws(()=>validateProject(p,guide),/Identidad/);}const p=copy();p.language='English';assert.throws(()=>validateProject(p,guide),/Identidad/);});
const route=h=>parseRoute(h,guide);
test('Rutas: home, categoría, sección y vistas',()=>{
  assert.deepEqual(route(''),{name:'home'});assert.deepEqual(route('#/'),{name:'home'});assert.deepEqual(route('#'),{name:'home'});
  assert.deepEqual(route('#/visuals'),{name:'category',id:'visuals'});
  assert.deepEqual(route('#/visuals.color'),{name:'section',id:'visuals.color',view:null});
  assert.deepEqual(route('#/visuals.color/info'),{name:'section',id:'visuals.color',view:'info'});
  assert.deepEqual(route('#/visuals.color/record'),{name:'section',id:'visuals.color',view:'record'});
});
test('Rutas: los ids, vistas y segmentos sobrantes desconocidos no se encuentran',()=>{
  for(const h of ['#/nope','#/visuals.color/other','#/visuals.color/info/x','#/visuals/info','#/visuals.color/guide','#/%E0%A4%A'])assert.equal(route(h).name,'notfound',h);
});
test('Rutas: los enlaces antiguos #item-<id> y #cat-<id> se traducen',()=>{
  assert.deepEqual(route('#item-visuals.color'),{name:'section',id:'visuals.color',view:null});
  assert.deepEqual(route('#cat-visuals'),{name:'category',id:'visuals'});
});
test('routeHash es la inversa de parseRoute',()=>{for(const h of ['#/','#/visuals','#/visuals.color','#/visuals.color/info','#/visuals.color/record'])assert.equal(routeHash(route(h)),h);});
test('El breadcrumb sigue categoría y subsección',()=>{
  assert.deepEqual(breadcrumb(guide,route('#/'),'Example DS'),[{label:'Example DS'}]);
  const c=breadcrumb(guide,route('#/visuals'),'Example DS');assert.equal(c.length,2);assert.equal(c[0].hash,'#/');assert.match(c[1].label,/^01 /);
  const s=breadcrumb(guide,route('#/visuals.color/info'),'Example DS');assert.deepEqual(s.map(x=>x.hash),['#/','#/visuals',undefined]);assert.equal(s[2].label,'1.1 Color');
});
test('Los vecinos siguen el orden de la guía entre categorías',()=>{
  const flat=guide.categories.flatMap(c=>c.items.map(i=>i.id));
  assert.deepEqual(neighbors(guide,flat[0]),{prev:null,next:flat[1]});
  assert.deepEqual(neighbors(guide,flat.at(-1)),{prev:flat.at(-2),next:null});
  const last0=guide.categories[0].items.at(-1).id;assert.equal(neighbors(guide,last0).next,guide.categories[1].items[0].id);
});
test('Vista por defecto: la página si existe y el estado es I o R; si no, Info',()=>{
  for(const [status,hasPage,view] of [['I',true,'content'],['R',true,'content'],['P',true,'info'],['N',true,'info'],['I',false,'info'],['R',false,'info']])assert.equal(defaultView({status},hasPage),view,`${status} ${hasPage}`);
});
test('Las tasks abiertas se separan en pending y future',()=>{
  const e={tasks:[{text:'a',when:'future'},{text:'b',when:'pending'},{text:'c',when:'pending'}]};
  const t=openTasks(e);assert.deepEqual(t.pending.map(x=>x.text),['b','c']);assert.deepEqual(t.future.map(x=>x.text),['a']);
});
