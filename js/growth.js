(() => {
  'use strict';
  const root = document.querySelector('[data-growth-page]');
  if (!root) return;
  const languages = ['zh-TW','en','ja','ko'];
  const messages = {
    sending:['正在保存，請稍候…','Saving your inquiry…','保存しています…','상담 요청을 저장하고 있습니다…'],
    success:['需求已保存。我會依序人工檢視後以 Email 回覆；尚未產生健檢報告，也不是簽約、付款或接案確認。','Your inquiry is saved. I will review it and reply by email. No audit report, contract, payment or project acceptance has been created.','保存しました。順番に確認しメールで返信します。診断結果・契約・決済・受注確定ではありません。','상담 요청이 저장되었습니다. 직접 검토 후 이메일로 답합니다. 점검 보고서 생성, 계약, 결제나 수주 확정은 아닙니다.'],
    failure:['未能確認送達，輸入已保留。請重試，或來信 inbox@boycelab.com；請勿重複改填相同需求。','Delivery could not be confirmed. Your input is preserved. Retry or email inbox@boycelab.com.','送信を確認できません。入力は保持しています。再試行またはメールでご連絡ください。','전송 여부를 확인하지 못했습니다. 입력은 유지됩니다. 다시 시도하거나 이메일로 연락해 주세요.'],
    limited:['這段時間提交較多，請稍後再試，或來信 inbox@boycelab.com。輸入內容已保留。','Too many recent submissions. Please retry later or email inbox@boycelab.com. Your input is preserved.','送信回数が多いため、後ほど再試行するかメールでご連絡ください。入力は保持しています。','최근 제출이 많습니다. 잠시 후 다시 시도하거나 이메일로 연락해 주세요. 입력은 유지됩니다.']
  };
  const originals = new Map();
  let feedbackState = '';
  let busy = false;
  const form = document.getElementById('growth-form');
  const feedback = document.getElementById('growth-feedback');
  const campaignKeys = ['source','medium','campaign','content'];
  function readStored(key) { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } }
  function writeStored(key, value) { try { if (value === null) sessionStorage.removeItem(key); else sessionStorage.setItem(key,JSON.stringify(value)); } catch {} }
  function index() { return Math.max(0, languages.indexOf(window.BoyceI18n?.locale || 'zh-TW')); }
  function apply() {
    const language = languages[index()];
    root.querySelectorAll('[data-growth-copy]').forEach(element => {
      if (!originals.has(element)) originals.set(element,element.textContent);
      element.textContent = language === 'zh-TW' ? originals.get(element) : element.dataset[language] || originals.get(element);
    });
    const title = document.querySelector('#growth-title');
    if (title) document.title = title.textContent + ' | BoyceLab';
    if (feedback && feedbackState) { feedback.textContent = messages[feedbackState][index()]; feedback.dataset.state = feedbackState; }
  }
  function captureSource() {
    const params = new URLSearchParams(location.search);
    const campaign = {};
    for (const key of campaignKeys) { const value = params.get('utm_'+key); if (value && /^[A-Za-z0-9_.-]{1,80}$/.test(value)) campaign[key] = value; }
    const stored = readStored('boycelab_growth_source');
    if (Object.keys(campaign).length || !stored) writeStored('boycelab_growth_source',{ landing_path:location.pathname.slice(0,200),campaign });
  }
  function setIntent() {
    if (!form) return;
    const audit = form.elements.intent.value === 'audit';
    form.elements.website.required = audit;
    form.querySelector('.growth-project-fields').hidden = form.elements.intent.value !== 'project';
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    busy = true;
    const fields = Object.fromEntries(new FormData(form));
    const storedSource = readStored('boycelab_growth_source') || {};
    const source = {};
    for (const key of campaignKeys) if (typeof storedSource.campaign?.[key] === 'string' && /^[A-Za-z0-9_.-]{1,80}$/.test(storedSource.campaign[key])) source[key] = storedSource.campaign[key];
    const payload = { ...fields,consent:fields.consent==='on',project_type:fields.intent==='audit'?'review':fields.project_type,budget:fields.intent==='project'?fields.budget:'discuss',timeline:'flexible',locale:languages[index()],landing_path:/^\/[a-zA-Z0-9/_-]*$/.test(storedSource.landing_path || '')?storedSource.landing_path:location.pathname,campaign:source };
    form.querySelector('fieldset').disabled = true;
    form.setAttribute('aria-busy','true');
    feedbackState = 'sending'; apply();
    try {
      const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(fields)));
      const fingerprint = Array.from(new Uint8Array(digest),value=>value.toString(16).padStart(2,'0')).join('');
      const last = readStored('boycelab_growth_request');
      const submission = last?.fingerprint === fingerprint && typeof last.id==='string' ? last : {fingerprint,id:crypto.randomUUID()};
      writeStored('boycelab_growth_request',submission);
      payload.client_id = submission.id;
      const base = window.BoyceApiConfig?.baseUrl || 'https://api.boycelab.com';
      const response = await fetch(base+'/project-inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(22000)});
      const result = await response.json();
      if (!response.ok || result.success !== true) { const error = new Error('Unconfirmed'); error.status=response.status; throw error; }
      form.reset(); setIntent(); writeStored('boycelab_growth_request',null);
      feedbackState = 'success';
      window.dispatchEvent(new CustomEvent('boycelab:inquirysaved',{detail:{intent:payload.intent,page:location.pathname}}));
    } catch (error) { feedbackState = error.status===429?'limited':'failure'; }
    finally { busy=false; form.querySelector('fieldset').disabled=false; form.removeAttribute('aria-busy'); apply(); feedback.focus({preventScroll:true}); }
  }
  captureSource();
  if (form) {
    const params = new URLSearchParams(location.search);
    if (['audit','project','partner'].includes(params.get('intent'))) form.elements.intent.value=params.get('intent');
    const requested = {brand:'business',app:'functional',booking:'functional',manufacturing:'business'}[params.get('service')];
    if (requested) form.elements.project_type.value=requested;
    form.elements.intent.addEventListener('change',setIntent);
    form.addEventListener('submit',submit);
    setIntent();
  }
  window.addEventListener('boycelab:languagechange',apply);
  apply();
})();
