const C='myfitness-v4';const F=['./','index.html','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// network-first, but only trust (and save) good responses; a 404/error falls back to the saved copy
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}
    return caches.match(e.request).then(m=>m||(e.request.mode==='navigate'?caches.match('index.html'):null)||r)}).catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))))});
