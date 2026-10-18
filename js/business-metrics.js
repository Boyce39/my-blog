(() => {
  'use strict';
  const root = document.querySelector('[data-growth-page]');
  if (!root || !location.pathname.startsWith('/business/')) return;
  const page = root.dataset.growthPage;
  const pathname = /^\/business\/[a-zA-Z0-9/_-]*$/.test(location.pathname) ? location.pathname : '/business/';
  const form = document.getElementById('growth-form');
  let started = false;
  const saved = new Set();
  function emit(event, values = {}) {
    if (navigator.globalPrivacyControl || ['1','yes'].includes(navigator.doNotTrack)) return;
    const detail = { event, business_page:page, page_path:pathname, ...values };
    try {
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag === 'function') {
        const { event:name, ...parameters } = detail;
        window.gtag('event',name,{...parameters,page_location:location.origin+pathname,page_referrer:''});
      } else window.dataLayer.push(detail);
      window.dispatchEvent(new CustomEvent('boycelab:growthmetric',{detail}));
    } catch {}
  }
  function intent() { return ['audit','project','partner'].includes(form?.elements.intent.value) ? form.elements.intent.value : 'project'; }
  emit('business_view');
  document.addEventListener('click',event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || !anchor.closest('.growth-body')) return;
    const url = new URL(anchor.href,location.href);
    let action = '';
    if (url.protocol === 'mailto:') action = 'email';
    else if (url.origin === location.origin && url.pathname === '/business/website-audit/') action = ['audit','project','partner'].includes(url.searchParams.get('intent')) ? url.searchParams.get('intent') : 'audit';
    else if (url.origin === location.origin && (url.pathname.startsWith('/business/work/') || url.hash === '#work')) action = 'case_study';
    else if (url.origin === location.origin && url.pathname === '/business/website-care/') action = 'plans';
    if (action) emit('business_cta_click',{action});
  });
  form?.addEventListener('input',event => {
    if (started || event.target.name === 'company') return;
    started = true;
    emit('business_form_start',{inquiry_type:intent()});
  });
  form?.addEventListener('submit',() => { if(form.checkValidity())emit('business_form_submit',{inquiry_type:intent()}); });
  window.addEventListener('boycelab:inquirysaved',event => {
    if (!['audit','project','partner'].includes(event.detail?.intent) || typeof event.detail.submissionId !== 'string' || saved.has(event.detail.submissionId)) return;
    saved.add(event.detail.submissionId);
    emit('generate_lead',{inquiry_type:event.detail.intent,method:'website_form'});
  });
})();
