const ASSETS_URLS = ["./", "./main.js", "./district.json", "./favicon.ico"];
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
