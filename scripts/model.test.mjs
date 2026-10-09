import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {validateGuide,validateProject,safePage,progressOf,pageCandidates} from '../model.js';
const guide=JSON.parse(await readFile(new URL('../data/guide.json',import.meta.url))),base=JSON.parse(await readFile(new URL('../data/project.json',import.meta.url)));const copy=()=>structuredClone(base),id=guide.categories[0].items[0].id;
test('Complete and pending template',()=>{assert.equal(validateProject(base,guide),true);assert.equal(progressOf(base).percent,0);});
test('Not applicable is excluded from progress; all N does not divide by zero',()=>{const p=copy();for(const s of Object.values(p.sections)){s.status='N';s.exclusionReason='Out of scope';}assert.equal(progressOf(p).percent,null);assert.equal(progressOf(p).scope,0);const s=p.sections[id];s.status='R';s.review={by:'Reviewer',date:'2026-10-08',evidence:'Tests recorded'};assert.equal(progressOf(p).percent,100);validateProject(p,guide);});
test('Rejects incomplete imports and unknown statuses',()=>{const p=copy();delete p.sections[id];assert.throws(()=>validateProject(p,guide));const q=copy();q.sections[id].status='A';assert.throws(()=>validateProject(q,guide));});
test('Ready and N require explicit evidence',()=>{for(const state of ['R','N']){const p=copy();p.sections[id].status=state;assert.throws(()=>validateProject(p,guide));}});
test('URLs and paths cannot run code or leave the repo',()=>{for(const s of ['javascript:alert(1)','data:text/html,test','../index.html','sections/../../index.html','https://user:password@example.com','file:///tmp/test.html','http://example.com'])assert.equal(safePage(s),false,s);for(const s of ['sections/visuals/color.html','sections/visuals/color.dc.html','https://example.com/design'])assert.equal(safePage(s),true,s);});
test('Rejects diverging versions and replaced IDs',()=>{const p=copy();p.schemaVersion=1;assert.throws(()=>validateProject(p,guide));const q=copy();q.sections.fake=q.sections[id];delete q.sections[id];assert.throws(()=>validateProject(q,guide));});
test('Without page, the page is the suggested path in both variants; with page, only that one',()=>{const item=guide.categories[0].items[0],s=copy().sections[id];assert.deepEqual(pageCandidates(item,s),[item.suggestedPath,item.suggestedPath.replace(/\.html$/,'.dc.html')]);s.page='https://example.com/design';assert.deepEqual(pageCandidates(item,s),['https://example.com/design']);});
test('Progress over applicable sections and complexity over the total',()=>{const p=copy(),ids=Object.keys(p.sections);assert.equal(progressOf(p).scope,100);assert.equal(progressOf(p).total,ids.length);for(const k of ids.slice(0,ids.length/2)){p.sections[k].status='N';p.sections[k].exclusionReason='Out of scope';}const r=progressOf(p);assert.equal(r.applicable,ids.length/2);assert.equal(r.scope,50);assert.equal(r.percent,0);});
const gcopy=()=>structuredClone(guide);
test('The guide is valid and checked on its own',()=>{assert.equal(validateGuide(guide),true);});
test('Guide: rejects duplicate IDs, IDs outside their category and wrong paths',()=>{
  const a=gcopy();a.categories[0].items[1].id=a.categories[0].items[0].id;assert.throws(()=>validateGuide(a),/Duplicate|Invalid/);
  const b=gcopy();b.categories[0].items[0].id='visuals.something';assert.throws(()=>validateGuide(b),/expected/);
  const c=gcopy();c.categories[0].items[0].suggestedPath='sections/other/x.html';assert.throws(()=>validateGuide(c),/suggested path/);
  const d=gcopy();d.categories[0].items[1].number=d.categories[0].items[0].number;assert.throws(()=>validateGuide(d),/number/);
  const e=gcopy();e.categories[0].items[0].objective=' ';assert.throws(()=>validateGuide(e),/Incomplete/);
});
test('A project may add a category and a subsection when guide and project agree',()=>{
  const g=gcopy(),p=copy();
  g.categories.push({id:'extra',number:'14',title:'Extra',objective:'Extra objective.',items:[{id:'extra.new-thing',number:'14.1',title:'New thing',objective:'o',define:'d',accessibility:'a',deliverable:'x',acceptance:['ok'],suggestedPath:'sections/extra/new-thing.html'}]});
  assert.equal(validateGuide(g),true);
  assert.throws(()=>validateProject(p,g),/Missing section entry/);
  p.sections['extra.new-thing']={status:'P',page:'',owner:'',notes:'',tasks:[],review:{by:'',date:'',evidence:''},exclusionReason:''};
  assert.equal(validateProject(p,g),true);
  assert.equal(progressOf(p).total,133);
});
test('Entries without a subsection in the guide are rejected',()=>{const p=copy();p.sections['visuals.ghost']=structuredClone(p.sections[id]);assert.throws(()=>validateProject(p,guide),/without a subsection/);});
test('Tasks: valid shapes pass; wrong type, extra keys and empty text are rejected',()=>{
  const p=copy();p.sections[id].tasks=[{text:'Define the dark theme',when:'future'},{text:'Approve values',when:'pending'}];assert.equal(validateProject(p,guide),true);
  for(const bad of [[{text:'x',when:'soon'}],[{text:'  ',when:'pending'}],[{text:'x',when:'pending',done:true}],['x'],{}]){const q=copy();q.sections[id].tasks=bad;assert.throws(()=>validateProject(q,guide),/Invalid tasks/);}
  const q=copy();delete q.sections[id].tasks;assert.throws(()=>validateProject(q,guide),/Invalid tasks/);
});
test('Tasks never block Ready and are not counted in progress',()=>{
  const p=copy(),s=p.sections[id];s.status='R';s.review={by:'Reviewer',date:'2026-10-09',evidence:'Checked'};
  s.tasks=[{text:'Define the dark theme',when:'future'},{text:'Approve values',when:'pending'}];
  assert.equal(validateProject(p,guide),true);
  assert.equal(progressOf(p).ready,1);
  assert.deepEqual(Object.keys(progressOf(p)).sort(),['applicable','percent','ready','scope','total']);
});
test('Project identity requires language and seed version',()=>{for(const k of ['language','seedVersion']){const p=copy();p[k]='';assert.throws(()=>validateProject(p,guide),/identity/);}const p=copy();p.language='English';assert.throws(()=>validateProject(p,guide),/identity/);});
