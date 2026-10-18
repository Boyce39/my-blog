(() => {
  'use strict';
  const root = document.querySelector('[data-growth-page]');
  const id = document.querySelector('meta[name="boycelab-ga4"]')?.content || '';
  if (!root || !location.pathname.startsWith('/business/') || !/^G-[A-Z0-9]{6,20}$/.test(id)) return;
  const key = 'boycelab_business_analytics';
  const banner = document.getElementById('business-analytics-consent');
  const status = document.getElementById('business-analytics-status');
  const locked = Boolean(navigator.globalPrivacyControl || ['1','yes'].includes(navigator.doNotTrack));
  const page = root.dataset.growthPage;
  const cleanUrl = location.origin+location.pathname;
  let referrer = '';
  try { const previous=new URL(document.referrer); if(previous.protocol==='https:'&&/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.com|threads\.(com|net)|instagram\.com|facebook\.com|github\.com|tasker\.com\.tw|pro360\.com\.tw)$/.test(previous.hostname))referrer=previous.origin+'/'; } catch {}
  const campaign = {};
  let storedCampaign = {};
  try { storedCampaign=JSON.parse(sessionStorage.getItem('boycelab_growth_source')||'null')?.campaign||{}; } catch {}
  const query = new URLSearchParams(location.search);
  for(const [source,target] of [['source','campaign_source'],['medium','campaign_medium'],['campaign','campaign_name'],['content','campaign_content']]) {
    const value=query.get('utm_'+source)||storedCampaign[source];
    if(typeof value==='string'&&/^[A-Za-z0-9_.-]{1,80}$/.test(value))campaign[target]=value;
  }
  const debug = new URLSearchParams(location.search).get('analytics_debug') === '1';
  const events = new Set(['business_view','business_cta_click','business_form_start','business_form_submit','generate_lead','business_demo_interaction']);
  const allowed = {action:new Set(['email','audit','project','partner','case_study','plans','preview','checkout','task_add','task_update','task_complete','task_delete','task_remove','cart_add','cart_update','cart_remove','cart_change','booking','inquiry','reset','style','device']),inquiry_type:new Set(['audit','project','partner']),method:new Set(['website_form']),service:new Set(['website','pos','tools'])};
  let consent = 'unknown';
  let initialized = false;
  let viewRequested = false;
  try { const stored=localStorage.getItem(key); if(['granted','denied'].includes(stored))consent=stored; } catch {}
  function send(event, values = {}) {
    if (locked || consent !== 'granted' || !initialized || !events.has(event)) return;
    const parameters = {business_page:page,page_path:location.pathname,page_location:cleanUrl,page_referrer:referrer,page_title:page,send_to:id,...campaign};
    for (const [name,set] of Object.entries(allowed)) if(set.has(values[name]))parameters[name]=values[name];
    if (debug) parameters.debug_mode = true;
    window.gtag('event',event,parameters);
  }
  function initialize() {
    if (locked || consent !== 'granted') return;
    window['ga-disable-'+id] = false;
    if (initialized) { window.gtag('consent','update',{analytics_storage:'granted'}); return; }
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('js',new Date());
    window.gtag('config',id,{send_page_view:false,page_location:cleanUrl,page_referrer:referrer,page_title:page,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:5184000,cookie_flags:'SameSite=Lax;Secure',...campaign});
    initialized = true;
    window.gtag('event','page_view',{page_location:cleanUrl,page_referrer:referrer,page_title:page,send_to:id,...campaign,...(debug?{debug_mode:true}:{})});
    if(viewRequested)send('business_view');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id='+id;
    script.dataset.businessAnalytics = 'true';
    script.onload = () => window.dispatchEvent(new CustomEvent('boycelab:analyticsstatus',{detail:{state:'loaded'}}));
    script.onerror = () => window.dispatchEvent(new CustomEvent('boycelab:analyticsstatus',{detail:{state:'blocked'}}));
    document.head.append(script);
  }
  function clearCookies() {
    for (const name of ['_ga','_ga_'+id.slice(2)]) {
      document.cookie = name+'=; Max-Age=0; Path=/; SameSite=Lax; Secure';
      for (const domain of [location.hostname,'.boycelab.com']) document.cookie=name+'=; Max-Age=0; Path=/; Domain='+domain+'; SameSite=Lax; Secure';
    }
  }
  function showStatus() {
    if(!status)return;
    status.querySelectorAll('[data-analytics-status]').forEach(item=>{item.hidden=item.dataset.analyticsStatus !== (locked?'blocked':'saved');});
    status.hidden = false;
  }
  function choose(value) {
    consent = value;
    try { localStorage.setItem(key,value); } catch {}
    if(value==='granted') initialize();
    else {
      window['ga-disable-'+id] = true;
      if(initialized)window.gtag('consent','update',{analytics_storage:'denied'});
      clearCookies();
    }
    if(banner)banner.hidden=true;
    showStatus();
  }
  document.querySelectorAll('[data-analytics-choice]').forEach(button=>button.addEventListener('click',()=>choose(button.dataset.analyticsChoice)));
  document.querySelectorAll('[data-analytics-settings]').forEach(button=>button.addEventListener('click',()=>{
    if(locked){showStatus();status?.scrollIntoView({block:'center'});return;}
    if(banner){banner.hidden=false;banner.scrollIntoView({block:'start'});banner.querySelector('button')?.focus({preventScroll:true});}
  }));
  window.BoyceBusinessAnalytics = {track(event,parameters){if(event==='business_view')viewRequested=true;send(event,parameters);},get consent(){return locked?'blocked':consent;}};
  if(banner)banner.hidden=locked||consent!=='unknown';
  if(locked)showStatus();
  else if(consent==='granted')initialize();
})();
