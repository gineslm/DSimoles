import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateProject,pageCandidates} from '../model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(path.join(root,p),'utf8');
const guide=JSON.parse(await read('data/guide.json')),project=JSON.parse(await read('data/project.json'));
validateProject(project,guide);
const ids=new Set(),paths=new Set();
for(const c of guide.categories)for(const i of c.items){if(ids.has(i.id)||paths.has(i.suggestedPath))throw Error('ID o destino duplicado');ids.add(i.id);paths.add(i.suggestedPath);for(const f of ['title','objective','define','accessibility','deliverable'])if(!i[f])throw Error(`Guía incompleta: ${i.id}`);}
const exists=p=>access(path.join(root,p)).then(()=>true,()=>false);
const items=new Map(guide.categories.flatMap(c=>c.items.map(i=>[i.id,i])));
const htmls=['index.html'],dcPages=[];for(const [id,s]of Object.entries(project.sections)){const cands=pageCandidates(items.get(id),s);if(cands[0].startsWith('https://'))continue;const present=[];for(const f of cands)if(await exists(f))present.push(f);if(present.length>1)throw Error(`${id} tiene dos páginas: ${present.join(' y ')}`);if(!present.length){if(s.page)throw Error(`La página de ${id} no existe: ${s.page}`);if(s.status==='I'||s.status==='R')throw Error(`${id} está en ${s.status} y no tiene página en ${cands.join(' ni ')}`);continue;}const file=present[0],content=await read(file);if(!content.includes(`name="ds-section-id" content="${id}"`))throw Error(`Meta de identidad ausente: ${file}`);htmls.push(file);if(file.endsWith('.dc.html'))dcPages.push(file);}
const runtime=['assets/_runtime/react.production.min.js','assets/_runtime/react-dom.production.min.js'],supports=new Map();
for(const file of dcPages){const html=await read(file),dir=path.dirname(file),srcs=[...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(m=>m[1]);const resolved=srcs.map(s=>/^https?:/.test(s)?s:path.posix.normalize(path.posix.join(dir,s)));const sup=resolved.indexOf(`${dir}/support.js`);if(sup<0)throw Error(`${file} no enlaza support.js`);for(const r of runtime)if(!(resolved.indexOf(r)>=0&&resolved.indexOf(r)<sup))throw Error(`${file} debe cargar ${r} antes de support.js`);if(resolved.some(s=>/^https?:/.test(s)))throw Error(`${file} enlaza scripts externos`);const bytes=await readFile(path.join(root,dir,'support.js'));supports.set(dir,bytes);}
for(const [dir,bytes]of supports){const src=bytes.toString('utf8');for(const [name,file]of [['REACT','react.production.min.js'],['REACT_DOM','react-dom.production.min.js']]){const sri=src.match(new RegExp(`var ${name}_SRI = "(sha384-[^"]+)"`))?.[1];if(!sri)throw Error(`${dir}/support.js no declara ${name}_SRI`);const own='sha384-'+createHash('sha384').update(await readFile(path.join(root,'assets/_runtime',file))).digest('base64');if(own!==sri)throw Error(`assets/_runtime/${file} no coincide con la versión que espera ${dir}/support.js. Actualiza el runtime vendorizado (ver assets/_runtime/README.md)`);}}
if(new Set([...supports.values()].map(b=>b.toString('base64'))).size>1)throw Error('Las copias de support.js no son idénticas: '+[...supports.keys()].join(', '));
for(const f of ['styles.css','app.js','model.js','CLAUDE.md','README.md','docs/handoff.md','docs/claude-code.md','docs/claude-design.md'])await access(path.join(root,f));
for(const file of htmls){const html=await read(file);for(const [,href]of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(/^(?:https?:|#|data:)/.test(href))continue;const target=path.resolve(root,path.dirname(file),href.split(/[?#]/)[0]);if(!target.startsWith(root+path.sep)&&target!==root)throw Error(`Referencia fuera del repo: ${href}`);await access(target);}}
console.log(`OK: ${guide.categories.length} categorías, ${ids.size} subsecciones y ${htmls.length} páginas enlazadas comprobadas.`);
