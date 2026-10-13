(function () {
  'use strict';
  const copy = {
    title: ['Build more than a website.\nMake it work for you.', '見せるだけではなく、\n仕事に役立つウェブサイトを。', '보여 주는 것을 넘어,\n실제로 일하는 웹사이트.'],
    intro: ['Brand websites, bookings, inquiries, orders, APIs, and automation. Clear, maintainable tools designed around your workflow.', 'ブランドサイト、予約、お問い合わせ、注文、API、自動化。業務の流れに合わせ、使いやすく保守できるツールを作ります。', '브랜드 사이트, 예약, 문의, 주문, API, 자동화. 업무 흐름에 맞춰 명확하고 유지보수 가능한 도구를 만듭니다.'],
    cta: ['Discuss your project →', 'ご相談はこちら →', '프로젝트 상담 →'], workCta: ['Explore the work', '作品を見る', '작품 보기'],
    note: ['Scope and pricing follow actual needs. Unconfirmed features are not promised.', '実際の要件に応じて範囲と費用を確認します。未確認の機能は約束しません。', '실제 요구에 따라 범위와 비용을 정합니다. 확인되지 않은 기능은 약속하지 않습니다.'],
    solutionsTitle: ['You may need more than a redesign.', '必要なのは、リニューアルだけではないかもしれません。', '단순한 디자인 변경보다 더 필요할 수 있습니다.'],
    solution1: ['Make services easy to understand', 'サービスをわかりやすく', '서비스를 이해하기 쉽게'],
    solution1Text: ['Organize your brand, services, and work so mobile visitors can find information and contact you.', 'ブランド、サービス、作品を整理し、スマートフォンでも情報や連絡先を見つけやすくします。', '브랜드, 서비스, 작품을 정리해 모바일에서도 정보와 연락처를 쉽게 찾게 합니다.'],
    solution2: ['Bring workflows online', '業務をオンラインへ', '업무를 온라인으로'],
    solution2Text: ['Design bookings, inquiries, orders, and file submissions to reduce repetitive coordination.', '予約、問い合わせ、注文、ファイル送信を設計し、繰り返しのやり取りを減らします。', '예약, 문의, 주문, 파일 제출을 설계해 반복적인 조율을 줄입니다.'],
    solution3: ['Connect your systems', 'システムをつなぐ', '시스템 연결'],
    solution3Text: ['Integrate APIs, notifications, and data processing with features that can be tested.', 'API、通知、データ処理を連携し、検証できる機能を作ります。', 'API, 알림, 데이터 처리를 연결하고 검증 가능한 기능을 만듭니다.'],
    workTitle: ['Work built around real use', '実際の利用から生まれた作品', '실제 사용을 위한 작품'],
    fepTitle: ['FepPhoto imaging services', 'FepPhoto フォトサービス', 'FepPhoto 사진 서비스'],
    fepText: ['Connecting brand and imaging-service presentation with online orders, file submissions, bookings, and store workflows. Available features follow the live site.', 'ブランドと写真サービスの紹介から、オンライン注文、ファイル送信、予約、店舗業務までをつなぐ設計です。利用可能な機能は公開サイトに準じます。', '브랜드와 사진 서비스 소개를 온라인 주문, 파일 제출, 예약, 매장 업무와 연결합니다. 이용 가능한 기능은 실제 사이트 기준입니다.'],
    live: ['Visit public website ↗', '公開サイトを見る ↗', '공개 사이트 보기 ↗'], architecture: ['Public architecture & trade-offs', '公開アーキテクチャと設計判断', '공개 아키텍처와 설계 판단'],
    fepArchitecture: ['The customer site uses authorized APIs. Workers handles logic, D1 stores structured records, and R2 stores files. Store workflows consider local persistence, background sync, and print queues. Payment status requires server verification.', '顧客サイトは認可APIを利用。Workersが業務ロジック、D1が構造化データ、R2がファイルを担当します。店舗ではローカル保存、背景同期、印刷キューを考慮し、決済はサーバーで検証します。', '고객 사이트는 인증된 API를 사용합니다. Workers는 로직, D1은 구조화된 기록, R2는 파일을 담당합니다. 매장 업무는 로컬 저장, 백그라운드 동기화, 인쇄 대기열을 고려하며 결제는 서버에서 검증합니다.'],
    boundary: ['Only principles are shared: no management links, configuration, keys, customer data, or operational records. Disabled payment integrations are not live features.', '原理のみを紹介します。管理URL、設定、鍵、顧客情報、業務記録は公開しません。未有効の決済連携は稼働中機能として扱いません。', '원리만 소개합니다. 관리 주소, 설정, 키, 고객 데이터, 운영 기록은 공개하지 않습니다. 비활성 결제 연동은 운영 기능으로 표시하지 않습니다.'],
    readCase: ['Read development notes →', '開発ノートを読む →', '개발 노트 읽기 →'], pixelTitle: ['Digital ordering for a coffee shop', 'カフェのデジタル注文体験', '카페의 디지털 주문 경험'],
    pixelText: ['Mobile menus, customization, prices, table QR codes, takeaway, and reservations—designed for customers and real store needs.', 'スマホのメニュー、カスタマイズ、価格、テーブルQR、持ち帰り、予約。顧客操作と実際の店舗業務を一緒に考えます。', '모바일 메뉴, 맞춤 옵션, 가격, 테이블 QR, 포장, 예약을 고객과 매장의 실제 요구에 맞춰 설계합니다.'],
    pixelArchitecture: ['Component-based interfaces connect to shared data through APIs. Ordering stays clear, with demos, live features, and pending devices tested separately.', 'コンポーネントによるUIとAPIで共有データを扱い、注文の流れを明確にします。デモ、正式機能、未連携機器は分けて検証します。', '컴포넌트 기반 UI와 API로 공유 데이터를 처리합니다. 주문 흐름을 명확히 하고 데모, 운영 기능, 미연동 장비를 구분해 검증합니다.'],
    pixelBoundary: ['Hardware printing, refunds, and some payments remain phased development. They are not presented as fully delivered. See the live site for public features.', '機器印刷、返金、一部決済は段階的な開発中です。すべて完成とは表現せず、公開機能は現在のサイトに準じます。', '하드웨어 인쇄, 환불, 일부 결제는 단계적으로 개발 중입니다. 모두 완성됐다고 표현하지 않으며 공개 기능은 현재 사이트 기준입니다.'],
    processTitle: ['A clear process before we begin.', '始める前に、進め方を明確に。', '시작 전에 명확한 협업 과정.'],
    process1: ['Define problems and required features', '課題と必要な機能を整理', '문제와 필수 기능 정의'], process2: ['Agree on scope, timeline, and cost', '範囲・期間・費用を確認', '범위, 일정, 비용 확인'], process3: ['Build and validate in stages', '段階ごとに制作・検証', '단계별 제작과 검증'], process4: ['Launch, handover, and maintenance', '公開・引き継ぎ・保守の相談', '배포, 인계, 유지보수'],
    inquiryTitle: ['Tell me what you need.', '必要なことを教えてください。', '필요한 것을 알려 주세요.'],
    inquiryIntro: ['Not sure which features you need? Describe how you work today and what you want to improve.', '必要な機能がまだ決まっていなくても大丈夫。今の業務と改善したいことを教えてください。', '필요한 기능이 정해지지 않아도 괜찮습니다. 현재 업무와 개선할 점을 알려 주세요.'],
    privacy: ['Used only to discuss your project, never displayed publicly. Do not send passwords, keys, order details, or sensitive data. This is not a payment, contract, or acceptance of work.', '情報は相談のためだけに利用し公開しません。パスワード、鍵、注文詳細、機密情報は送らないでください。決済、契約、受注確約ではありません。', '프로젝트 상담에만 사용하며 공개하지 않습니다. 비밀번호, 키, 주문 상세, 민감한 자료는 보내지 마세요. 결제, 계약, 수주 확약이 아닙니다.'],
    name: ['Your name *', 'お名前 *', '이름 *'], organization: ['Company / brand', '会社・ブランド', '회사 / 브랜드'], website: ['Current website', '現在のサイト', '현재 웹사이트'], projectType: ['What would you like to discuss? *', 'ご相談内容 *', '상담 주제 *'],
    typeFunctional: ['Functional website', '機能型ウェブサイト', '기능형 웹사이트'], typeBusiness: ['Brand / business website', 'ブランド・商業サイト', '브랜드 / 비즈니스 사이트'], typeAutomation: ['APIs & automation', 'API・自動化', 'API 및 자동화'], typeReview: ['Improve an existing website', '既存サイトの改善', '기존 사이트 개선'],
    budget: ['Budget range', '予算の目安', '예산 범위'], budgetDiscuss: ['Discuss requirements first', 'まず要件を相談', '요구사항 먼저 상담'], timeline: ['Desired timeline', '希望の期間', '희망 일정'], timeFlexible: ['Flexible', '相談可能', '협의 가능'], timeMonth: ['Within about a month', '約1か月以内', '약 한 달 이내'], timeThree: ['Within about three months', '約3か月以内', '약 세 달 이내'], message: ['Requirements & workflow to improve *', '要望と改善したい業務 *', '요구사항 및 개선할 업무 *'],
    consent: ['I agree BoyceLab may use this information to discuss this project.', 'この相談への連絡にBoyceLabが上記情報を使うことに同意します。', 'BoyceLab이 이 프로젝트 상담을 위해 위 정보를 사용하는 데 동의합니다.'], submit: ['Send project inquiry', '相談を送信', '프로젝트 문의 보내기'],
    sending: ['Saving your inquiry…', 'お問い合わせを保存中…', '문의 저장 중…'], success: ['Saved successfully. I will review your request and contact you by email. No contract or payment has been made.', '保存しました。内容を確認後、メールで連絡します。契約や決済は行われていません。', '정상 저장되었습니다. 내용을 검토한 후 이메일로 연락하겠습니다. 계약이나 결제는 이루어지지 않았습니다.'], failure: ['Could not confirm delivery. Your input is preserved; retry or contact me by email.', '送信を確認できませんでした。入力は保持しています。再試行またはメールでご連絡ください。', '전송을 확인하지 못했습니다. 입력은 유지됩니다. 다시 시도하거나 이메일로 연락해 주세요.']
  };
  const originals = new Map();
  let busy = false;
  let clientId = crypto.randomUUID();
  let feedbackState = '';
  const statusZh = { sending: '正在保存需求…', success: '需求已保存。我會先確認內容，再透過 Email 聯絡你；這不是簽約或付款成功通知。', failure: '未能確認送達，輸入內容已保留。請重試或改用 Email 聯絡。' };
  function localeIndex() { return ['en', 'ja', 'ko'].indexOf(window.BoyceI18n?.locale); }
  function translate(key) { const index = localeIndex(); return index < 0 ? statusZh[key] : copy[key]?.[index]; }
  function apply() {
    const index = localeIndex();
    document.querySelectorAll('[data-business-copy]').forEach(function (element) {
      if (!originals.has(element)) originals.set(element, element.dataset.businessCopy === 'title' ? '不只做網站。\n讓網站真正替你工作。' : element.textContent);
      element.textContent = index < 0 ? originals.get(element) : copy[element.dataset.businessCopy]?.[index] || originals.get(element);
    });
    if (feedbackState) document.getElementById('inquiryFeedback').textContent = translate(feedbackState);
  }
  async function submit(event) {
    event.preventDefault();
    if (busy || !event.currentTarget.reportValidity()) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    const button = form.querySelector('button[type=submit]');
    busy = true;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    feedbackState = 'sending';
    apply();
    try {
      const base = window.BoyceApiConfig?.baseUrl || 'https://api.boycelab.com';
      const response = await fetch(`${base}/project-inquiries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit',
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ ...fields, consent: fields.consent === 'on', locale: window.BoyceI18n?.locale || 'zh-TW', client_id: clientId })
      });
      const payload = await response.json();
      if (!response.ok || payload.success !== true) throw new Error('Not confirmed');
      form.reset();
      clientId = crypto.randomUUID();
      feedbackState = 'success';
    } catch {
      feedbackState = 'failure';
    } finally {
      busy = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      apply();
    }
  }
  function initialize() {
    apply();
    document.getElementById('projectInquiryForm')?.addEventListener('submit', submit);
    document.getElementById('projectInquiryForm')?.addEventListener('input', function () {
      if (!busy && feedbackState === 'failure') clientId = crypto.randomUUID();
    });
    window.addEventListener('boycelab:languagechange', apply);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
