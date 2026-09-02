(() => {
  'use strict';

  const SUPPORTED = ['zh-TW', 'en', 'ja', 'ko'];
  const STORAGE_KEY = 'boycelab_language';
  const LABELS = { 'zh-TW': ['中', '繁體中文'], en: ['EN', 'English'], ja: ['日', '日本語'], ko: ['한', '한국어'] };
  const translations = {
    en: {
      '首頁': 'Home', '文章列表': 'Articles', '關於我': 'About', '歸檔': 'Archive', 'AI助理': 'AI Assistant', '匿名留言': 'Anonymous', '友站': 'Friends',
      '技術、數學與持續探索。': 'Technology, mathematics, and continuous exploration.',
      '目前為': 'Currently a ', '中興大學大一應用數學系（數據分析與計算組）學生': 'first-year Applied Mathematics student at NCHU (Data Analysis & Computing)',
      '專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': 'Focused on Python automation, cybersecurity research, and data applications—turning what I learn into clear, extensible projects and articles.',
      '閱讀技術文章': 'Read articles', '認識我': 'About me', '查看公開匿名牆 →': 'View public anonymous wall →', '送出匿名訊息': 'Send anonymously',
      '現在關注的三個': 'Three current ', '方向': 'directions', '不追求堆疊名詞，而是把每個主題做成可驗證的程式、研究筆記或完整專案。': 'I turn each topic into verifiable code, research notes, or complete projects instead of collecting buzzwords.',
      '數據分析與計算': 'Data analysis & computing', '從應用數學出發，建立資料處理、分析建模與計算思維的基礎。': 'Building foundations in data processing, analytical modeling, and computational thinking through applied mathematics.',
      '資安研究': 'Security research', '持續參與 AIS3、CTF 與漏洞分析，並將解題過程整理成可重現的紀錄。': 'Continuing with AIS3, CTFs, and vulnerability analysis while documenting reproducible solutions.',
      'Python 自動化': 'Python automation', '用程式改善重複流程，實作 API 串接、資料處理、硬體整合與 AI 應用。': 'Improving repetitive workflows with API integration, data processing, hardware, and AI applications.',
      '從筆記到作品的': 'From notes to ', '實作紀錄': 'working projects', '專案實作': 'Projects', '自動化、硬體整合與完整產品紀錄。': 'Automation, hardware integration, and complete product records.',
      '資安筆記': 'Security notes', 'CTF、課程紀錄與安全研究整理。': 'CTFs, course notes, and security research.', 'AI 助理': 'AI assistant', '串接 Cloudflare Workers 與 Gemini 的互動實驗。': 'Interactive experiments with Cloudflare Workers and Gemini.',
      '所有文章': 'All articles', '依時間閱讀完整學習與成長軌跡。': 'Browse the complete learning journey by date.', '部分': 'Selected ', '成就': 'achievements',
      '偶爾寄一封': 'Occasional ', '技術近況': 'technical updates', '不定期分享新文章、研究筆記與專案進度，不發廣告信。': 'New articles, research notes, and project updates—no advertising.', '訂閱更新': 'Subscribe',
      '保持': 'Stay in ', '聯絡': 'touch', '交流技術、研究想法或單純打聲招呼。': 'Talk technology, share research ideas, or simply say hello.', '可以透過 Email 或 GitHub 找到我；所有匿名問題統一從網站匿名版送出。': 'Reach me through email or GitHub. Please send anonymous questions through the website.',
      'READER DISCUSSION': 'READER DISCUSSION', '文章留言': 'Comments', '不需要登入，留下名稱與想法即可。': 'No sign-in required—just leave your name and thoughts.', '不用登入，留下顯示名稱與想說的話即可。': 'No sign-in required—just leave your display name and thoughts.', '讀取中': 'Loading', '顯示名稱': 'Display name', '你的名稱': 'Your name', '留言內容': 'Comment', '分享想法、補充內容，或告訴我哪裡可以寫得更好。': 'Share a thought, add context, or tell me what could be improved.', '公開頁面只顯示名稱、留言與時間；安全稽核資料僅供站長處理濫用。': 'Only your name, comment, and time are public. Security audit data is visible only to the site owner for abuse handling.', '送出留言': 'Post comment', '讀者留言': 'Reader comments', '重新整理': 'Refresh', '文章留言分頁': 'Comment pages',
      '搜尋文章內容...': 'Search articles…', '輸入關鍵字開始搜尋...': 'Enter a keyword to search…', '標籤': 'Tags'
    },
    ja: {
      '首頁': 'ホーム', '文章列表': '記事', '關於我': 'プロフィール', '歸檔': 'アーカイブ', 'AI助理': 'AIアシスタント', '匿名留言': '匿名メッセージ', '友站': 'リンク',
      '技術、數學與持續探索。': '技術、数学、そして探究を続ける。', '目前為': '現在、', '中興大學大一應用數學系（數據分析與計算組）學生': '国立中興大学 応用数学科（データ分析・計算組）1年生',
      '專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': 'Python自動化、セキュリティ研究、データ活用を中心に、学びを分かりやすい作品と記事にまとめています。',
      '閱讀技術文章': '技術記事を読む', '認識我': 'プロフィール', '查看公開匿名牆 →': '匿名メッセージを見る →', '送出匿名訊息': '匿名で送る',
      '現在關注的三個': '現在取り組む3つの', '方向': '分野', '不追求堆疊名詞，而是把每個主題做成可驗證的程式、研究筆記或完整專案。': '言葉を並べるのではなく、検証できるコード・研究ノート・完成したプロジェクトにします。',
      '數據分析與計算': 'データ分析と計算', '從應用數學出發，建立資料處理、分析建模與計算思維的基礎。': '応用数学から、データ処理・分析モデル・計算思考の基礎を築きます。', '資安研究': 'セキュリティ研究', '持續參與 AIS3、CTF 與漏洞分析，並將解題過程整理成可重現的紀錄。': 'AIS3、CTF、脆弱性分析に取り組み、再現可能な記録として整理します。', 'Python 自動化': 'Python自動化', '用程式改善重複流程，實作 API 串接、資料處理、硬體整合與 AI 應用。': 'API連携、データ処理、ハードウェア、AIで反復作業を改善します。',
      '從筆記到作品的': 'ノートから作品への', '實作紀錄': '実装記録', '專案實作': 'プロジェクト', '自動化、硬體整合與完整產品紀錄。': '自動化、ハードウェア統合、製品開発の記録。', '資安筆記': 'セキュリティノート', 'CTF、課程紀錄與安全研究整理。': 'CTF、授業、セキュリティ研究の記録。', 'AI 助理': 'AIアシスタント', '串接 Cloudflare Workers 與 Gemini 的互動實驗。': 'Cloudflare WorkersとGeminiを使った対話実験。', '所有文章': 'すべての記事', '依時間閱讀完整學習與成長軌跡。': '時系列で学びと成長の記録を読む。',
      '部分': '主な', '成就': '実績', '偶爾寄一封': 'ときどき届く', '技術近況': '技術便り', '不定期分享新文章、研究筆記與專案進度，不發廣告信。': '新しい記事、研究ノート、プロジェクトの進捗を不定期でお届けします。広告はありません。', '訂閱更新': '購読する', '保持': 'つながりを', '聯絡': '保つ', '交流技術、研究想法或單純打聲招呼。': '技術や研究の話、気軽なあいさつも歓迎です。',
      'READER DISCUSSION': '読者コメント', '文章留言': '記事コメント', '不需要登入，留下名稱與想法即可。': 'ログイン不要。名前とコメントだけで投稿できます。', '不用登入，留下顯示名稱與想說的話即可。': 'ログイン不要。表示名とコメントだけで投稿できます。', '讀取中': '読み込み中', '顯示名稱': '表示名', '你的名稱': 'お名前', '留言內容': 'コメント', '分享想法、補充內容，或告訴我哪裡可以寫得更好。': '感想や補足、改善できる点を教えてください。', '公開頁面只顯示名稱、留言與時間；安全稽核資料僅供站長處理濫用。': '公開されるのは名前・コメント・時刻のみです。安全監査情報は不正利用対応のため管理者だけが確認します。', '送出留言': '投稿する', '讀者留言': '読者コメント', '重新整理': '更新', '文章留言分頁': 'コメントのページ', '搜尋文章內容...': '記事を検索…', '輸入關鍵字開始搜尋...': 'キーワードを入力してください…', '標籤': 'タグ'
    },
    ko: {
      '首頁': '홈', '文章列表': '글', '關於我': '소개', '歸檔': '아카이브', 'AI助理': 'AI 도우미', '匿名留言': '익명 메시지', '友站': '친구 사이트',
      '技術、數學與持續探索。': '기술, 수학, 그리고 끊임없는 탐구.', '目前為': '현재 ', '中興大學大一應用數學系（數據分析與計算組）學生': '국립중흥대학교 응용수학과(데이터 분석·계산) 1학년 학생', '專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': 'Python 자동화, 보안 연구, 데이터 활용을 중심으로 배운 내용을 이해하기 쉬운 프로젝트와 글로 정리합니다.',
      '閱讀技術文章': '기술 글 읽기', '認識我': '소개 보기', '查看公開匿名牆 →': '공개 익명 게시판 →', '送出匿名訊息': '익명 메시지 보내기', '現在關注的三個': '현재 집중하는 세 가지 ', '方向': '분야', '不追求堆疊名詞，而是把每個主題做成可驗證的程式、研究筆記或完整專案。': '용어를 나열하기보다 검증 가능한 코드, 연구 노트, 완성된 프로젝트로 만듭니다.',
      '數據分析與計算': '데이터 분석과 계산', '從應用數學出發，建立資料處理、分析建模與計算思維的基礎。': '응용수학을 바탕으로 데이터 처리, 분석 모델링, 계산적 사고의 기초를 쌓습니다.', '資安研究': '보안 연구', '持續參與 AIS3、CTF 與漏洞分析，並將解題過程整理成可重現的紀錄。': 'AIS3, CTF, 취약점 분석에 참여하고 재현 가능한 기록으로 정리합니다.', 'Python 自動化': 'Python 자동화', '用程式改善重複流程，實作 API 串接、資料處理、硬體整合與 AI 應用。': 'API 연동, 데이터 처리, 하드웨어 통합, AI로 반복 작업을 개선합니다.',
      '從筆記到作品的': '노트에서 작품으로 이어지는 ', '實作紀錄': '구현 기록', '專案實作': '프로젝트', '自動化、硬體整合與完整產品紀錄。': '자동화, 하드웨어 통합, 제품 개발 기록.', '資安筆記': '보안 노트', 'CTF、課程紀錄與安全研究整理。': 'CTF, 수업, 보안 연구 정리.', 'AI 助理': 'AI 도우미', '串接 Cloudflare Workers 與 Gemini 的互動實驗。': 'Cloudflare Workers와 Gemini를 연동한 대화형 실험.', '所有文章': '모든 글', '依時間閱讀完整學習與成長軌跡。': '시간순으로 학습과 성장 기록을 읽습니다.',
      '部分': '주요 ', '成就': '성과', '偶爾寄一封': '가끔 보내는 ', '技術近況': '기술 소식', '不定期分享新文章、研究筆記與專案進度，不發廣告信。': '새 글, 연구 노트, 프로젝트 진행 상황만 비정기적으로 공유합니다.', '訂閱更新': '구독하기', '保持': '연락 ', '聯絡': '하기', '交流技術、研究想法或單純打聲招呼。': '기술과 연구 아이디어를 나누거나 편하게 인사해 주세요.',
      'READER DISCUSSION': '독자 댓글', '文章留言': '글 댓글', '不需要登入，留下名稱與想法即可。': '로그인 없이 이름과 의견만 남기면 됩니다.', '不用登入，留下顯示名稱與想說的話即可。': '로그인 없이 표시 이름과 의견만 남기면 됩니다.', '讀取中': '불러오는 중', '顯示名稱': '표시 이름', '你的名稱': '이름', '留言內容': '댓글', '分享想法、補充內容，或告訴我哪裡可以寫得更好。': '의견을 나누거나 내용을 보충하고 개선할 점을 알려 주세요.', '公開頁面只顯示名稱、留言與時間；安全稽核資料僅供站長處理濫用。': '공개 페이지에는 이름, 댓글, 시간만 표시됩니다. 보안 감사 정보는 악용 대응을 위해 관리자만 확인합니다.', '送出留言': '댓글 등록', '讀者留言': '독자 댓글', '重新整理': '새로고침', '文章留言分頁': '댓글 페이지', '搜尋文章內容...': '글 검색…', '輸入關鍵字開始搜尋...': '검색어를 입력하세요…', '標籤': '태그'
    }
  };

  const locale = chooseLocale();
  document.documentElement.lang = locale;
  window.BoyceI18n = { locale, t: translate, setLocale, apply: applyTranslations };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  function start() {
    createSwitcher();
    applyTranslations(document.body);
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node.nodeType === Node.ELEMENT_NODE) applyTranslations(node);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.dispatchEvent(new CustomEvent('boycelab:languagechange', { detail: { locale } }));
  }

  function chooseLocale() {
    const queryLocale = normalizeLocale(new URLSearchParams(location.search).get('lang'));
    if (queryLocale) return queryLocale;
    try {
      const stored = normalizeLocale(localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch (_) {}
    for (const language of navigator.languages || [navigator.language]) {
      const normalized = normalizeLocale(language);
      if (normalized) return normalized;
    }
    return 'zh-TW';
  }

  function normalizeLocale(value) {
    const input = String(value || '').toLowerCase();
    if (input === 'zh-tw' || input.startsWith('zh-hant')) return 'zh-TW';
    if (input === 'ja' || input.startsWith('ja-')) return 'ja';
    if (input === 'ko' || input.startsWith('ko-')) return 'ko';
    if (input === 'en' || input.startsWith('en-')) return 'en';
    return null;
  }

  function setLocale(nextLocale) {
    if (!SUPPORTED.includes(nextLocale)) return;
    try { localStorage.setItem(STORAGE_KEY, nextLocale); } catch (_) {}
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(nextLocale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    const url = new URL(location.href);
    url.searchParams.set('lang', nextLocale);
    location.href = url.toString();
  }

  function createSwitcher() {
    const host = document.getElementById('sub-nav') || document.body;
    const control = document.createElement('div');
    control.className = `site-language-control${host === document.body ? ' floating' : ''}`;
    control.innerHTML = `<button class="site-language-button" type="button" aria-haspopup="true" aria-expanded="false" title="Language / 語言"><span aria-hidden="true">文</span><b>${LABELS[locale][0]}</b></button><div class="site-language-menu" hidden>${SUPPORTED.map(code => `<button type="button" data-site-locale="${code}" aria-current="${code === locale ? 'true' : 'false'}"><span>${LABELS[code][1]}</span><i>${code}</i></button>`).join('')}</div>`;
    if (host === document.body) host.appendChild(control);
    else host.insertBefore(control, host.firstChild);
    const toggle = control.querySelector('.site-language-button');
    const menu = control.querySelector('.site-language-menu');
    toggle.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', event => {
      const option = event.target.closest('[data-site-locale]');
      if (option) setLocale(option.dataset.siteLocale);
    });
    document.addEventListener('click', event => {
      if (!control.contains(event.target)) { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  function translate(text) {
    return locale === 'zh-TW' ? text : translations[locale]?.[text] || text;
  }

  function applyTranslations(root) {
    if (locale === 'zh-TW' || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest('script,style,pre,code,[data-i18n-skip]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const original = node.nodeValue.trim();
      const replacement = translations[locale]?.[original];
      if (replacement) node.nodeValue = node.nodeValue.replace(original, replacement);
    }
    const selector = 'input,textarea,[placeholder],[aria-label],[title]';
    const elements = root.matches?.(selector) ? [root, ...root.querySelectorAll(selector)] : root.querySelectorAll?.(selector) || [];
    for (const element of elements) {
      for (const attribute of ['placeholder', 'aria-label', 'title']) {
        const value = element.getAttribute(attribute);
        if (value && translations[locale]?.[value]) element.setAttribute(attribute, translations[locale][value]);
      }
    }
  }
})();
