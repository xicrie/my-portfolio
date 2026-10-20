import {build} from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL}from'node:url';
import {execFileSync}from'node:child_process';
const temporary='.prerender';
try{
 await build({configFile:'vite.config.ts',build:{ssr:'src/entry-static.tsx',outDir:temporary,emptyOutDir:true,rollupOptions:{output:{entryFileNames:'entry-static.mjs'}}},logLevel:'warn'});
 const {renderHome,renderCases,author}=await import(pathToFileURL(path.resolve(temporary,'entry-static.mjs')));
 const template=await fs.readFile('dist/index.html','utf8');const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
 const head=(html,structured)=>html.replace('</head>',`<script type="application/ld+json">${json(structured)}</script></head>`);
 // Static snapshot is readable before JS; the existing client renderer owns interactions.
 let home=renderHome().replace(/opacity:0(?=;|\")/g,'opacity:1');
 await fs.writeFile('dist/index.html',head(template.replace('<div id="root"></div>',`<div id="root">${home}</div>`),{'@context':'https://schema.org','@type':'ProfilePage','@id':'https://xicrie.ru/#profile',url:'https://xicrie.ru/',name:'Алёна Степанова: AI, автоматизация и маркетинг',mainEntity:author}));
 const pages=await renderCases();const urls=['https://xicrie.ru/'];
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 for(const page of pages){
  const url=`https://xicrie.ru/cases/${page.id}/`;urls.push(url);
  let html=template.replace(/<script type="module"[^>]*><\/script>/g,'').replace(/<link rel="modulepreload"[^>]*>/g,'');
  html=html.replace(/<title>.*?<\/title>/s,`<title>${escape(page.title)} | Алёна Степанова</title>`)
   .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g,`$1${escape(page.description)}`)
   .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g,`$1${escape(page.title+' | Алёна Степанова')}`)
   .replace(/(<link rel="canonical" href=")[^"]*/,`$1${url}`).replace(/(<meta property="og:url" content=")[^"]*/,`$1${url}`)
   .replace('property="og:type" content="profile"','property="og:type" content="article"')
   .replace('<div id="root"></div>',`<div id="root">${page.html}</div>`);
  const schema={'@context':'https://schema.org','@type':'CreativeWork','@id':url+'#case',url,name:page.title,description:page.description,inLanguage:'ru',author};
  await fs.mkdir(`dist/cases/${page.id}`,{recursive:true});await fs.writeFile(`dist/cases/${page.id}/index.html`,head(html,schema));
 }
 await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
 await fs.writeFile('dist/robots.txt','User-agent: *\nAllow: /\n\nSitemap: https://xicrie.ru/sitemap.xml\n');
 const css=template.match(/<link rel="stylesheet"[^>]+>/g)?.join('')??'';
 await fs.writeFile('dist/404.html',`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Страница не найдена | Алёна Степанова</title>${css}</head><body><main class="mx-auto max-w-2xl px-6 py-24"><h1 class="type-section">Страница не найдена</h1><p class="type-body my-6">Адрес мог измениться. Все актуальные проекты собраны в портфолио.</p><a href="/" class="text-lg underline">Перейти к портфолио</a></main></body></html>`);
 const commit=process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();await fs.writeFile('dist/version.json',JSON.stringify({commit,builtAt:new Date().toISOString(),cases:pages.map(p=>p.id)},null,2));
 console.log(`Prerendered homepage and ${pages.length} case pages. Sitemap and 404 generated.`);
}finally{await fs.rm(temporary,{recursive:true,force:true})}
