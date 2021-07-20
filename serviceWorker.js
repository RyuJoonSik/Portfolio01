const ASSETS_URLS = ["./", "./main.js", "./district.json"];
const CACHE_NAME = "my-cache";

/* 서비스 워커 설치 */
self.addEventListener("install", function (event) {
  /* 설치 단계 */
  event.waitUntil(
    /* 1.원하는 캐시 이름을 사용하여 caches.open() 호출 */
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");

      /* 2. URL 배열을 전달 */
      return cache.addAll(ASSETS_URLS);

      /* 3 모든 파일이 성공적으로 캐시되면 서비스 워커 설치 */
    })
  );
});

/* 요청 캐시 및 반환 */
self.addEventListener("fetch", function (event) {
  event.respondWith(
    /* 요청 확인 후 서비스 워커가 생성한 캐시에서 일치하는 캐시가 있는지 탐색 */
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log("일치하는 캐시가 존재합니다.");
        /* 일치하는 값이 있을 경우 */
        return response;
      }

      /* 네트워크에서 검색한 데이터가 있으면 해당 데이터를 반환 */
      return fetch(event.request);
    })
  );
});
// async function cacheFirst(req) {
//   console.log("cacheFirst");
//   const cachedResponse = caches.match(req);
//   return cachedResponse || fetch(req);
// }

// async function newtorkFirst(req) {
//   const cache = await caches.open("dynamic-cache");

//   try {
//     const res = await fetch(req);
//     cache.put(req, res.clone());
//     return res;
//   } catch (error) {
//     return await cache.match(req);
//   }
// }

// /* install 이벤트는 브라우저가 새로운 서비스 워커를 감지할 때마다 호출 */
// self.addEventListener("install", async (event) => {
//   console.log("install");
//   /*
//     cacheName과 일치하는 Cache 객체를 resolve한 Promise 반환
//     일치하는 Cache가 없을 경우 cacheName의 이름으로 생성된 새로운 Cache객체를 resolve한 Promise 반환
//   */
//   const cache = await caches.open(CACHE_NAME);
//   /* URL 배열을 가져와 주어진 cache에 응답  */
//   cache.addAll(ASSETS_URLS);
// });

// self.addEventListener("fetch", (event) => {
//   const req = event.request;
//   const url = new URL(req.url);
//   /* url.origin : 도메인 */
//   if (url.origin === location.url) {
//     /* 등록된 이벤트에 응답하기 위해 respondWith()를 호출 */
//     event.respondWith(cacheFirst(req));
//   } else {
//     event.respondWith(newtorkFirst(req));
//   }
// });
