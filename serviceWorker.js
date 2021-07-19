const staticAssets = ["./", "./main.js", "./district.json"];

async function cacheFirst(req) {
  console.log("cacheFirst");
  const cachedResponse = caches.match(req);
  return cachedResponse || fetch(req);
}

async function newtorkFirst(req) {
  console.log("newtorkFirst");
  const cache = await caches.open("dynamic-cache");

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}

self.addEventListener("install", async (event) => {
  console.log("install");
  const cache = await caches.open("static-cache");
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", (event) => {
  console.log("fetch");
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin === location.url) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(newtorkFirst(req));
  }
});
