(() => {
  'use strict';
  const destination = document.querySelector('meta[name="boycelab-business-destination"]')?.content;
  if (!destination || !/^\/business\/[a-z0-9/-]*$/.test(destination)) return;
  const target = new URL(destination,location.origin);
  if (target.pathname === location.pathname) return;
  target.search = location.search;
  target.hash = location.hash;
  location.replace(target.href);
})();
