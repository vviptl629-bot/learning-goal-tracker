// 学习目标管理台 Service Worker —— 安全版：只缓存图标，绝不缓存 HTML/页面
// 设计原则：导航请求永远走网络，避免旧空白页被缓存导致白屏复发。
const CACHE = "lstm-icon-v3";
const ICON = "icon.svg";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add(ICON)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", e => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

// 只拦截图标请求（缓存优先）；其余（含页面导航）一律放行走网络。
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (!req.url.endsWith("/icon.svg") && !req.url.endsWith("icon.svg")) return;
  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
    )
  );
});
