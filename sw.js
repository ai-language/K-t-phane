self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',function(e){
  if(new URL(e.request.url).pathname==='/K-t-phane/player'){
    e.respondWith(
      caches.open('nhg-player').then(function(c){
        return c.match(e.request).then(function(r){
          return r||new Response('<h1>Yükleniyor...</h1>',{status:200,headers:{'Content-Type':'text/html'}});
        });
      })
    );
  }
});
