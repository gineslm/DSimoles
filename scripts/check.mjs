import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateProject} from '../model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(path.join(root,p),'utf8');
const guide=JSON.parse(await read('data/guide.json')),project=JSON.parse(await read('data/project.json'));
validateProject(project,guide);
const ids=new Set(),paths=new Set();
for(const c of guide.categories)for(const i of c.items){if(ids.has(i.id)||paths.has(i.suggestedPath))throw Error('ID o destino duplicado');ids.add(i.id);paths.add(i.suggestedPath);for(const f of ['title','objective','define','accessibility','deliverable'])if(!i[f])throw Error(`Guía incompleta: ${i.id}`);}
const htmls=['index.html'];for(const [id,s]of Object.entries(project.sections)){if(!s.page||s.page.startsWith('https://'))continue;const content=await read(s.page);if(!content.includes(`name="ds-section-id" content="${id}"`))throw Error(`Meta de identidad ausente: ${s.page}`);htmls.push(s.page);}
for(const f of ['styles.css','app.js','model.js','CLAUDE.md','README.md','docs/handoff.md','docs/claude-code.md','docs/claude-design.md'])await access(path.join(root,f));
for(const file of htmls){const html=await read(file);for(const [,href]of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(/^(?:https?:|#|data:)/.test(href))continue;const target=path.resolve(root,path.dirname(file),href.split(/[?#]/)[0]);if(!target.startsWith(root+path.sep)&&target!==root)throw Error(`Referencia fuera del repo: ${href}`);await access(target);}}
console.log(`OK: ${guide.categories.length} categorías, ${ids.size} subsecciones y ${htmls.length} páginas enlazadas comprobadas.`);
