const staticAssets = ["./", "./main.js", "./district.json"];

async function cacheFirst(req) {
  const cachedResponse = caches.match(req);
  return cachedResponse || fetch(req);
}

async function newtorkFirst(req) {
  const cache = await caches.open("dynamic-cache");

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}

/* install 이벤트는 브라우저가 새로운 서비스 워커를 감지할 때마다 호출 */
self.addEventListener("install", async (event) => {
  console.log("install");
  /* 
    cacheName과 일치하는 Cache 객체를 resolve한 Promise 반환
    일치하는 Cache가 없을 경우 cacheName의 이름으로 생성된 새로운 Cache객체를 resolve한 Promise 반환
  */
  const cache = await caches.open("static-cache");
  /* URL 배열을 가져와 주어진 cache에 응답  */
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  /* url.origin : 도메인 */
  if (url.origin === location.url) {
    /* 등록된 이벤트에 응답하기 위해 respondWith()를 호출 */
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(newtorkFirst(req));
  }
});
