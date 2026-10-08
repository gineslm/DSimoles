import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateProject,pagePath} from '../model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(path.join(root,p),'utf8');
const guide=JSON.parse(await read('data/guide.json')),project=JSON.parse(await read('data/project.json'));
validateProject(project,guide);
const ids=new Set(),paths=new Set();
for(const c of guide.categories)for(const i of c.items){if(ids.has(i.id)||paths.has(i.suggestedPath))throw Error('ID o destino duplicado');ids.add(i.id);paths.add(i.suggestedPath);for(const f of ['title','objective','define','accessibility','deliverable'])if(!i[f])throw Error(`Guía incompleta: ${i.id}`);}
const exists=p=>access(path.join(root,p)).then(()=>true,()=>false);
const items=new Map(guide.categories.flatMap(c=>c.items.map(i=>[i.id,i])));
const htmls=['index.html'];for(const [id,s]of Object.entries(project.sections)){const file=pagePath(items.get(id),s);if(file.startsWith('https://'))continue;if(!await exists(file)){if(s.page)throw Error(`La página de ${id} no existe: ${file}`);if(s.status==='I'||s.status==='R')throw Error(`${id} está en ${s.status} y no tiene página en ${file}`);continue;}const content=await read(file);if(!content.includes(`name="ds-section-id" content="${id}"`))throw Error(`Meta de identidad ausente: ${file}`);htmls.push(file);}
for(const f of ['styles.css','app.js','model.js','CLAUDE.md','README.md','docs/handoff.md','docs/claude-code.md','docs/claude-design.md'])await access(path.join(root,f));
for(const file of htmls){const html=await read(file);for(const [,href]of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(/^(?:https?:|#|data:)/.test(href))continue;const target=path.resolve(root,path.dirname(file),href.split(/[?#]/)[0]);if(!target.startsWith(root+path.sep)&&target!==root)throw Error(`Referencia fuera del repo: ${href}`);await access(target);}}
console.log(`OK: ${guide.categories.length} categorías, ${ids.size} subsecciones y ${htmls.length} páginas enlazadas comprobadas.`);
