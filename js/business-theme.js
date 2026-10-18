(() => {
  'use strict';
  let saved;
  try { saved = localStorage.getItem('boycelab_business_theme'); } catch {}
  document.documentElement.setAttribute('theme',saved === 'dark' ? 'dark' : 'light');
  function connect() {
    document.getElementById('theme-btn')?.addEventListener('click',() => {
      const next = document.documentElement.getAttribute('theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('theme',next);
      try { localStorage.setItem('boycelab_business_theme',next); } catch {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',connect,{once:true});
  else connect();
})();
