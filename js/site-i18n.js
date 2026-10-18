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
      '。專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': '. Focused on Python automation, cybersecurity research, and data applications—turning what I learn into clear, extensible projects and articles.',
      '閱讀技術文章': 'Read articles', '認識我': 'About me', '查看公開匿名牆 →': 'View public anonymous wall →', '送出匿名訊息': 'Send anonymously',
      '現在關注的三個': 'Three current ', '方向': 'directions', '不追求堆疊名詞，而是把每個主題做成可驗證的程式、研究筆記或完整專案。': 'I turn each topic into verifiable code, research notes, or complete projects instead of collecting buzzwords.',
      '數據分析與計算': 'Data analysis & computing', '從應用數學出發，建立資料處理、分析建模與計算思維的基礎。': 'Building foundations in data processing, analytical modeling, and computational thinking through applied mathematics.',
      '資安研究': 'Security research', '持續參與 AIS3、CTF 與漏洞分析，並將解題過程整理成可重現的紀錄。': 'Continuing with AIS3, CTFs, and vulnerability analysis while documenting reproducible solutions.',
      'Python 自動化': 'Python automation', '用程式改善重複流程，實作 API 串接、資料處理、硬體整合與 AI 應用。': 'Improving repetitive workflows with API integration, data processing, hardware, and AI applications.',
      '從筆記到作品的': 'From notes to ', '實作紀錄': 'working projects', '專案實作': 'Projects', '自動化、硬體整合與完整產品紀錄。': 'Automation, hardware integration, and complete product records.',
      '資安筆記': 'Security notes', 'CTF、課程紀錄與安全研究整理。': 'CTFs, course notes, and security research.', 'AI 助理': 'AI assistant', '串接 Cloudflare Workers 與 Gemini 的互動實驗。': 'Interactive experiments with Cloudflare Workers and Gemini.',
      '所有文章': 'All articles', '依時間閱讀完整學習與成長軌跡。': 'Browse the complete learning journey by date.', '部分': 'Selected ', '成就': 'achievements',
      '第 66 屆第 6 分區中小學科學展覽會': '66th District 6 Elementary and Secondary School Science Fair', '第 25 屆旺宏科學獎': '25th Macronix Science Award', '全國中小學科學展覽（第 65 屆・電腦與資訊學科）': '65th National Science Fair · Computer & Information Science', '114 分區資訊學科能力競賽複賽': '2025 Regional Information Science Competency Contest', '第十屆 AIS3「好厲駭」資安年訓': '10th AIS3 Cybersecurity Annual Program', '全民 e 化資訊運動會': 'National E-Learning Information Competition', '全國 YIF 青少年生成式 AI 黑客松': 'National YIF Youth Generative AI Hackathon', '特優': 'Grand Award', '佳作': 'Honorable Mention', '學員': 'Participant', 'Python 與資訊科技概論全國第一': 'National 1st Place in Python & Introduction to IT', '季軍': 'Third Place',
      '偶爾寄一封': 'Occasional ', '技術近況': 'technical updates', '不定期分享新文章、研究筆記與專案進度，不發廣告信。': 'New articles, research notes, and project updates—no advertising.', '訂閱更新': 'Subscribe',
      '保持': 'Stay in ', '聯絡': 'touch', '交流技術、研究想法或單純打聲招呼。': 'Talk technology, share research ideas, or simply say hello.', '可以透過 Email 或 GitHub 找到我；所有匿名問題統一從網站匿名版送出。': 'Reach me through email or GitHub. Please send anonymous questions through the website.', '用技術記錄探索，也用作品連結彼此。': 'Documenting exploration with technology and connecting through projects.',
      'READER DISCUSSION': 'READER DISCUSSION', '文章留言': 'Comments', '不需要登入，留下名稱與想法即可。': 'No sign-in required—just leave your name and thoughts.', '不用登入，留下顯示名稱與想說的話即可。': 'No sign-in required—just leave your display name and thoughts.', '讀取中': 'Loading', '顯示名稱': 'Display name', '你的名稱': 'Your name', '留言內容': 'Comment', '分享想法、補充內容，或告訴我哪裡可以寫得更好。': 'Share a thought, add context, or tell me what could be improved.', '公開頁面只顯示名稱、留言與時間；安全稽核資料僅供站長處理濫用。': 'Only your name, comment, and time are public. Security audit data is visible only to the site owner for abuse handling.', '送出留言': 'Post comment', '讀者留言': 'Reader comments', '重新整理': 'Refresh', '文章留言分頁': 'Comment pages',
      '搜尋文章內容...': 'Search articles…', '輸入關鍵字開始搜尋...': 'Enter a keyword to search…', '標籤': 'Tags'
    },
    ja: {
      '首頁': 'ホーム', '文章列表': '記事', '關於我': 'プロフィール', '歸檔': 'アーカイブ', 'AI助理': 'AIアシスタント', '匿名留言': '匿名メッセージ', '友站': 'リンク',
      '技術、數學與持續探索。': '技術、数学、そして探究を続ける。', '目前為': '現在、', '中興大學大一應用數學系（數據分析與計算組）學生': '国立中興大学 応用数学科（データ分析・計算組）1年生',
      '專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': 'Python自動化、セキュリティ研究、データ活用を中心に、学びを分かりやすい作品と記事にまとめています。',
      '。專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': '。Python自動化、セキュリティ研究、データ活用を中心に、学びを分かりやすい作品と記事にまとめています。',
      '閱讀技術文章': '技術記事を読む', '認識我': 'プロフィール', '查看公開匿名牆 →': '匿名メッセージを見る →', '送出匿名訊息': '匿名で送る',
      '現在關注的三個': '現在取り組む3つの', '方向': '分野', '不追求堆疊名詞，而是把每個主題做成可驗證的程式、研究筆記或完整專案。': '言葉を並べるのではなく、検証できるコード・研究ノート・完成したプロジェクトにします。',
      '數據分析與計算': 'データ分析と計算', '從應用數學出發，建立資料處理、分析建模與計算思維的基礎。': '応用数学から、データ処理・分析モデル・計算思考の基礎を築きます。', '資安研究': 'セキュリティ研究', '持續參與 AIS3、CTF 與漏洞分析，並將解題過程整理成可重現的紀錄。': 'AIS3、CTF、脆弱性分析に取り組み、再現可能な記録として整理します。', 'Python 自動化': 'Python自動化', '用程式改善重複流程，實作 API 串接、資料處理、硬體整合與 AI 應用。': 'API連携、データ処理、ハードウェア、AIで反復作業を改善します。',
      '從筆記到作品的': 'ノートから作品への', '實作紀錄': '実装記録', '專案實作': 'プロジェクト', '自動化、硬體整合與完整產品紀錄。': '自動化、ハードウェア統合、製品開発の記録。', '資安筆記': 'セキュリティノート', 'CTF、課程紀錄與安全研究整理。': 'CTF、授業、セキュリティ研究の記録。', 'AI 助理': 'AIアシスタント', '串接 Cloudflare Workers 與 Gemini 的互動實驗。': 'Cloudflare WorkersとGeminiを使った対話実験。', '所有文章': 'すべての記事', '依時間閱讀完整學習與成長軌跡。': '時系列で学びと成長の記録を読む。',
      '部分': '主な', '成就': '実績', '第 66 屆第 6 分區中小學科學展覽會': '第66回 第6地区 小中学校科学展', '第 25 屆旺宏科學獎': '第25回 Macronix科学賞', '全國中小學科學展覽（第 65 屆・電腦與資訊學科）': '第65回 全国小中学校科学展・コンピューター情報部門', '114 分區資訊學科能力競賽複賽': '2025年 地区情報科学能力競技大会', '第十屆 AIS3「好厲駭」資安年訓': '第10回 AIS3 サイバーセキュリティ年間研修', '全民 e 化資訊運動會': '全国e化情報競技大会', '全國 YIF 青少年生成式 AI 黑客松': '全国YIF青少年生成AIハッカソン', '特優': '最優秀賞', '佳作': '佳作', '學員': '研修生', 'Python 與資訊科技概論全國第一': 'Python・情報技術概論 全国1位', '季軍': '3位', '偶爾寄一封': 'ときどき届く', '技術近況': '技術便り', '不定期分享新文章、研究筆記與專案進度，不發廣告信。': '新しい記事、研究ノート、プロジェクトの進捗を不定期でお届けします。広告はありません。', '訂閱更新': '購読する', '保持': 'つながりを', '聯絡': '保つ', '交流技術、研究想法或單純打聲招呼。': '技術や研究の話、気軽なあいさつも歓迎です。', '可以透過 Email 或 GitHub 找到我；所有匿名問題統一從網站匿名版送出。': 'メールまたはGitHubからご連絡ください。匿名の質問はサイトの匿名ページからお願いします。', '用技術記錄探索，也用作品連結彼此。': '技術で探究を記録し、作品を通してつながります。',
      'READER DISCUSSION': '読者コメント', '文章留言': '記事コメント', '不需要登入，留下名稱與想法即可。': 'ログイン不要。名前とコメントだけで投稿できます。', '不用登入，留下顯示名稱與想說的話即可。': 'ログイン不要。表示名とコメントだけで投稿できます。', '讀取中': '読み込み中', '顯示名稱': '表示名', '你的名稱': 'お名前', '留言內容': 'コメント', '分享想法、補充內容，或告訴我哪裡可以寫得更好。': '感想や補足、改善できる点を教えてください。', '公開頁面只顯示名稱、留言與時間；安全稽核資料僅供站長處理濫用。': '公開されるのは名前・コメント・時刻のみです。安全監査情報は不正利用対応のため管理者だけが確認します。', '送出留言': '投稿する', '讀者留言': '読者コメント', '重新整理': '更新', '文章留言分頁': 'コメントのページ', '搜尋文章內容...': '記事を検索…', '輸入關鍵字開始搜尋...': 'キーワードを入力してください…', '標籤': 'タグ'
    },
    ko: {
      '首頁': '홈', '文章列表': '글', '關於我': '소개', '歸檔': '아카이브', 'AI助理': 'AI 도우미', '匿名留言': '익명 메시지', '友站': '친구 사이트',
      '技術、數學與持續探索。': '기술, 수학, 그리고 끊임없는 탐구.', '目前為': '현재 ', '中興大學大一應用數學系（數據分析與計算組）學生': '국립중흥대학교 응용수학과(데이터 분석·계산) 1학년 학생', '專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': 'Python 자동화, 보안 연구, 데이터 활용을 중심으로 배운 내용을 이해하기 쉬운 프로젝트와 글로 정리합니다.',
      '。專注於 Python 自動化、資安研究與資料應用，把學習過程整理成能被理解、也能被延伸的作品與文章。': '. Python 자동화, 보안 연구, 데이터 활용을 중심으로 배운 내용을 이해하기 쉬운 프로젝트와 글로 정리합니다.',
      '閱讀技術文章': '기술 글 읽기', '認識我': '소개 보기', '查看公開匿名牆 →': '공개 익명 게시판 →', '送出匿名訊息': '익명 메시지 보내기', '現在關注的三個': '현재 집중하는 세 가지 ', '方向': '분야', '不追求堆疊名詞，而是把每個主題做成可驗證的程式、研究筆記或完整專案。': '용어를 나열하기보다 검증 가능한 코드, 연구 노트, 완성된 프로젝트로 만듭니다.',
      '數據分析與計算': '데이터 분석과 계산', '從應用數學出發，建立資料處理、分析建模與計算思維的基礎。': '응용수학을 바탕으로 데이터 처리, 분석 모델링, 계산적 사고의 기초를 쌓습니다.', '資安研究': '보안 연구', '持續參與 AIS3、CTF 與漏洞分析，並將解題過程整理成可重現的紀錄。': 'AIS3, CTF, 취약점 분석에 참여하고 재현 가능한 기록으로 정리합니다.', 'Python 自動化': 'Python 자동화', '用程式改善重複流程，實作 API 串接、資料處理、硬體整合與 AI 應用。': 'API 연동, 데이터 처리, 하드웨어 통합, AI로 반복 작업을 개선합니다.',
      '從筆記到作品的': '노트에서 작품으로 이어지는 ', '實作紀錄': '구현 기록', '專案實作': '프로젝트', '自動化、硬體整合與完整產品紀錄。': '자동화, 하드웨어 통합, 제품 개발 기록.', '資安筆記': '보안 노트', 'CTF、課程紀錄與安全研究整理。': 'CTF, 수업, 보안 연구 정리.', 'AI 助理': 'AI 도우미', '串接 Cloudflare Workers 與 Gemini 的互動實驗。': 'Cloudflare Workers와 Gemini를 연동한 대화형 실험.', '所有文章': '모든 글', '依時間閱讀完整學習與成長軌跡。': '시간순으로 학습과 성장 기록을 읽습니다.',
      '部分': '주요 ', '成就': '성과', '第 66 屆第 6 分區中小學科學展覽會': '제66회 제6지구 초·중등 과학전람회', '第 25 屆旺宏科學獎': '제25회 Macronix 과학상', '全國中小學科學展覽（第 65 屆・電腦與資訊學科）': '제65회 전국 초·중등 과학전람회 · 컴퓨터·정보 부문', '114 分區資訊學科能力競賽複賽': '2025 지역 정보과학 역량대회', '第十屆 AIS3「好厲駭」資安年訓': '제10회 AIS3 사이버보안 연간 교육', '全民 e 化資訊運動會': '전국 e-정보 경진대회', '全國 YIF 青少年生成式 AI 黑客松': '전국 YIF 청소년 생성형 AI 해커톤', '特優': '최우수상', '佳作': '장려상', '學員': '교육생', 'Python 與資訊科技概論全國第一': 'Python·정보기술개론 전국 1위', '季軍': '3위', '偶爾寄一封': '가끔 보내는 ', '技術近況': '기술 소식', '不定期分享新文章、研究筆記與專案進度，不發廣告信。': '새 글, 연구 노트, 프로젝트 진행 상황만 비정기적으로 공유합니다.', '訂閱更新': '구독하기', '保持': '연락 ', '聯絡': '하기', '交流技術、研究想法或單純打聲招呼。': '기술과 연구 아이디어를 나누거나 편하게 인사해 주세요.', '可以透過 Email 或 GitHub 找到我；所有匿名問題統一從網站匿名版送出。': '이메일이나 GitHub로 연락해 주세요. 익명 질문은 사이트의 익명 게시판을 이용해 주세요.', '用技術記錄探索，也用作品連結彼此。': '기술로 탐구를 기록하고 작품으로 연결합니다.',
      'READER DISCUSSION': '독자 댓글', '文章留言': '글 댓글', '不需要登入，留下名稱與想法即可。': '로그인 없이 이름과 의견만 남기면 됩니다.', '不用登入，留下顯示名稱與想說的話即可。': '로그인 없이 표시 이름과 의견만 남기면 됩니다.', '讀取中': '불러오는 중', '顯示名稱': '표시 이름', '你的名稱': '이름', '留言內容': '댓글', '分享想法、補充內容，或告訴我哪裡可以寫得更好。': '의견을 나누거나 내용을 보충하고 개선할 점을 알려 주세요.', '公開頁面只顯示名稱、留言與時間；安全稽核資料僅供站長處理濫用。': '공개 페이지에는 이름, 댓글, 시간만 표시됩니다. 보안 감사 정보는 악용 대응을 위해 관리자만 확인합니다.', '送出留言': '댓글 등록', '讀者留言': '독자 댓글', '重新整理': '새로고침', '文章留言分頁': '댓글 페이지', '搜尋文章內容...': '글 검색…', '輸入關鍵字開始搜尋...': '검색어를 입력하세요…', '標籤': '태그'
    }
  };

  const interfaceCopy = {
    '文章': ['Articles', '記事', '글'],
    '更新日誌': ['Changelog', '更新履歴', '업데이트 기록'],
    '作品與文章': ['Work and articles', '作品と記事', '작품과 글'],
    '探索網站': ['Explore the site', 'サイトを探索', '사이트 둘러보기'],
    'FepPhoto 功能型平台：把顧客網站與門市流程接起來': ['FepPhoto: connecting the customer website with store workflows', 'FepPhoto：顧客サイトと店舗の業務をつなぐ', 'FepPhoto: 고객 웹사이트와 매장 업무 연결'],
    '最近的興趣：用 BoyceLab 做小店真正用得上的功能型網站': ['What I am exploring: useful functional websites for small businesses', '最近の関心：小さなお店に役立つ機能型サイト', '최근 관심: 소규모 매장에 유용한 기능형 웹사이트'],
    'Pixel364 點餐設計：從咖啡菜單到一張說得清楚的訂單': ['Pixel364 ordering: from a coffee menu to a clear order', 'Pixel364の注文設計：メニューから明確な注文へ', 'Pixel364 주문 설계: 커피 메뉴에서 명확한 주문까지'],
    '從共用授權 API、Cloudflare Workers／D1／R2，到本機交易、付款通知與列印佇列，整理 FepPhoto 的公開架構與實作界線。': ['Public FepPhoto architecture: authorized APIs, Workers, D1, R2, local transactions, payment verification, and print queues—with clear implementation boundaries.', '認可API、Workers、D1、R2、ローカル取引、決済検証、印刷キュー。FepPhotoの公開設計と実装の範囲を整理します。', '인증 API, Workers, D1, R2, 로컬 거래, 결제 검증, 인쇄 대기열을 통해 FepPhoto의 공개 설계와 구현 범위를 정리합니다.'],
    '從 FepPhoto 與 Pixel364 出發，記錄我對小型商家網站與自動化的思考：先理解流程，再界定功能、例外與維護責任。': ['From FepPhoto and Pixel364: understanding workflows before defining features, exceptions, and maintenance responsibilities.', 'FepPhotoとPixel364から、業務を理解して機能・例外・保守の責任を定める考え方をまとめます。', 'FepPhoto와 Pixel364를 통해 업무를 이해한 뒤 기능, 예외, 유지보수 책임을 정하는 과정을 기록합니다.'],
    '整理 Pixel364 的菜單、客製選項、桌邊 QR、外帶與預約設計，以及 React／Vite／TypeScript、Workers／D1 的分工和未完成整合。': ['Pixel364 menus, customization, table QR, takeaway, and reservations: frontend/backend responsibilities and integrations still in progress.', 'Pixel364のメニュー、カスタマイズ、テーブルQR、持ち帰り、予約。フロントエンドとバックエンドの役割、未完成の連携も説明します。', 'Pixel364 메뉴, 맞춤 옵션, 테이블 QR, 포장, 예약 설계와 프론트엔드·백엔드 역할, 진행 중인 연동을 정리합니다.'],
    'BoyceLab 實作筆記': ['BoyceLab build notes', 'BoyceLab 開発ノート', 'BoyceLab 개발 노트'],
    'BoyceLab 創業筆記': ['BoyceLab business notes', 'BoyceLab 起業ノート', 'BoyceLab 창업 노트'],
    'FtO Seoul 2026：在 rep0rter 專案裡，和不同國家的人一起合作': ['FtO Seoul 2026: collaborating across borders with rep0rter', 'FtO Seoul 2026：rep0rterで国を越えて協働する', 'FtO Seoul 2026: rep0rter에서 국경을 넘어 협업하다'],
    '九月在首爾參加 Facing the Ocean，加入 rep0rter 專案，也認識不同國家與背景的夥伴。這不是得獎故事，而是一次跨國開源協作的紀錄。': ['Joining rep0rter at Facing the Ocean in Seoul: an account of international open-source collaboration, not a competition result.', 'ソウルのFacing the Oceanでrep0rterに参加。受賞ではなく、国際的なオープンソース協働の記録です。', '서울 Facing the Ocean에서 rep0rter에 참여한 기록. 수상이 아닌 국제 오픈소스 협업 이야기입니다.'],
    '青年百億加州見習：把 AI、永續與英文協作放在同一張桌上': ['Learning in California: AI, sustainability, and collaboration in English', 'カリフォルニアで学ぶ：AI、持続可能性、英語での協働', '캘리포니아에서 배우다: AI, 지속가능성, 영어 협업'],
    '整理青年百億加州見習與 ReValue AI 團隊發表：從永續議題出發，練習解釋 AI 能做什麼、不能做什麼，再把經驗帶回來分享。': ['Reflecting on the California program and ReValue AI presentation: exploring what AI can and cannot do for sustainability.', '海外見学とReValue AIの発表を振り返り、持続可能性のためにAIができることと限界を考えます。', '캘리포니아 프로그램과 ReValue AI 발표를 돌아보며 지속가능성을 위한 AI의 가능성과 한계를 살펴봅니다.'],
    '從科展到 AI 安全：不只做出作品，也學會把問題問清楚': ['From science fairs to AI security: learning to ask better questions', '科学展からAIセキュリティへ：問いを明確にする学び', '과학전람회에서 AI 보안으로: 더 명확하게 질문하는 법'],
    '從智慧回收系統到 RAG 文件注入研究，整理科展與旺宏科學獎這段路，還有我如何從「做出來」走向「說清楚、驗證清楚」。': ['From smart recycling to RAG document injection research: moving beyond building a project to explaining and verifying it.', 'スマートリサイクルからRAGの文書注入研究へ。作るだけでなく、説明と検証へ進んだ記録。', '스마트 재활용에서 RAG 문서 주입 연구까지. 만드는 것을 넘어 설명하고 검증하는 과정입니다.'],
    '文章與學習紀錄': ['Articles & learning notes', '記事と学習ノート', '글과 학습 기록'],
    '不只有技術教學，也記錄研究、作品與活動心得。選一個你有興趣的主題開始。': ['Tutorials, research, projects, and reflections. Start with a topic you like.', '技術解説、研究、作品、活動の振り返り。興味のあるテーマからどうぞ。', '기술 안내, 연구, 프로젝트, 활동 후기. 관심 있는 주제부터 읽어 보세요.'],
    '近況與心得 →': ['Recent activities →', '近況と振り返り →', '근황과 후기 →'],
    '資安研究 →': ['Security research →', 'セキュリティ研究 →', '보안 연구 →'],
    '專案作品 →': ['Projects →', 'プロジェクト →', '프로젝트 →'],
    '演算法筆記 →': ['Algorithm notes →', 'アルゴリズムノート →', '알고리즘 노트 →'],
    '前往網站 ↗ · 在新分頁開啟': ['Visit website ↗ · Opens a new tab', 'サイトへ ↗ · 新しいタブで開く', '웹사이트 방문 ↗ · 새 탭에서 열기'],
    '想聊聊？': ['Want to talk?', '話してみませんか？', '이야기해 볼까요?'],
    '最近在做什麼': ['Recent activities', '最近の活動', '최근 활동'],
    '把經驗寫成': ['Turning experiences into ', '経験を', '경험을 '],
    '可以分享的故事': ['stories worth sharing', '伝えられる物語に', '나눌 수 있는 이야기로'],
    '看所有文章 →': ['Browse all articles →', 'すべての記事を見る →', '모든 글 보기 →'],
    '先從這三篇開始：研究、海外學習，以及和不同國家的人一起做開源專案。不熟悉技術也可以閱讀。': ['Start with research, learning abroad, and international open-source collaboration. No technical background needed.', '研究、海外での学び、国際的なオープンソース活動から。専門知識がなくても読めます。', '연구, 해외 학습, 국제 오픈소스 협업부터 읽어 보세요. 기술 지식이 없어도 괜찮습니다.'],
    '閱讀這篇文章': ['Read the article', '記事を読む', '글 읽기'],
    '研究與科展': ['Research & science fairs', '研究と科学展', '연구와 과학전람회'],
    '海外學習': ['Learning abroad', '海外での学び', '해외 학습'],
    '開源與國際交流': ['Open source & exchange', 'オープンソースと国際交流', '오픈소스와 국제 교류'],
    '為什麼選擇應用數學 →': ['Why applied mathematics? →', '応用数学を選んだ理由 →', '응용수학을 선택한 이유 →'],
    '閱讀資安筆記 →': ['Read security notes →', 'セキュリティノートを読む →', '보안 노트 읽기 →'],
    '查看程式作品 →': ['Explore projects →', 'プログラミング作品を見る →', '프로젝트 보기 →'],
    '和 AI 聊聊程式、學習或科技問題。': ['Ask AI about programming, learning, or technology.', 'プログラミングや学習、技術の話をAIと。', 'AI와 프로그래밍, 학습, 기술에 대해 이야기해 보세요.'],
    '朋友的網站': ['Friends on the web', '友達のサイト', '친구들의 웹사이트'],
    '逛逛大家的作品與生活。': ['Explore their projects and stories.', 'みんなの作品や日々をのぞいてみよう。', '친구들의 작품과 일상을 둘러보세요.'],
    '探索不同的觀點': ['Explore different perspectives', '違った視点に出会う', '다양한 관점 만나기'],
    '已加入的友站': ['Website directory', 'サイト一覧', '웹사이트 목록'],
    '搜尋友站': ['Search websites', 'サイトを検索', '웹사이트 검색'],
    '網站名稱、簡介或網址': ['Name, description, or URL', 'サイト名、紹介文、URL', '이름, 소개, URL'],
    '申請友站': ['Submit your website', 'サイトを申請', '웹사이트 신청'],
    '申請加入友站': ['Submit your website', 'サイトの掲載を申請', '웹사이트 등록 신청'],
    '網站名稱': ['Website name', 'サイト名', '웹사이트 이름'],
    '網站網址': ['Website URL', 'サイトURL', '웹사이트 URL'],
    '網站簡介': ['Description', '紹介文', '소개'],
    '聯絡方式': ['Contact information', '連絡先', '연락처'],
    '送出申請': ['Submit application', '申請を送信', '신청 보내기'],
    '歡迎交換連結': ['Share your corner of the web', 'リンクをつなぎましょう', '링크를 나눠요'],
    '大家的問題與我的回答': ['Your questions, my answers', 'みんなの質問と私の回答', '여러분의 질문과 나의 답변'],
    '匿名提問，公開回覆。': ['Anonymous questions, public answers.', '匿名の質問、公開の回答。', '익명 질문, 공개 답변.'],
    '公開回覆': ['Public answers', '公開回答', '공개 답변'],
    '審核與回覆後才公開': ['Reviewed before publishing', '確認・返信後に公開', '검토하고 답변한 뒤 공개'],
    '不用登入，也不用留下名字': ['No sign-in or name needed', 'ログインも名前も不要', '로그인과 이름이 필요 없어요'],
    '歡迎隨便問我問題。': ['Feel free to ask me anything.', '気軽に質問してください。', '편하게 질문해 주세요.'],
    '查看公開回覆牆': ['Read public answers', '公開回答を見る', '공개 답변 보기'],
    '閱讀全文': ['Read more', '続きを読む', '계속 읽기'],
    '跳到主要內容': ['Skip to main content', '本文へスキップ', '본문으로 이동'],
    '搜尋文章': ['Search articles', '記事を検索', '글 검색'],
    '切換深淺色主題': ['Toggle color theme', 'テーマを切り替える', '테마 전환'],
    '開啟導覽選單': ['Open navigation', 'メニューを開く', '메뉴 열기'],
    '作品與合作': ['Work & collaboration', '制作実績とご相談', '작품과 협업'],
    '網站服務': ['Website services', 'ウェブ制作', '웹사이트 서비스'],
    '免費網站健檢': ['Free website review', '無料サイト診断', '무료 웹사이트 점검'],
    '公司與品牌網站': ['Business websites', '企業・ブランドサイト', '기업·브랜드 사이트'],
    '客製功能開發': ['Custom applications', '業務機能開発', '맞춤 기능 개발'],
    '合作夥伴': ['Partnerships', 'パートナー募集', '파트너십'],
    '合作洽詢': ['Discuss a project', '制作のご相談', '협업 문의'],
    '作品': ['Work', '制作実績', '작품'],
    '探索': ['Explore', '探究', '탐구'],
    '用技術記錄探索，讓網站真正派上用場。': ['Documenting exploration through technology and building websites that are truly useful.', '技術で探究を記録し、本当に役立つウェブサイトを作ります。', '기술로 탐구를 기록하고 실제로 도움이 되는 웹사이트를 만듭니다.'],
    '把想法做成真正好用的網站。': ['Turn ideas into websites that truly work.', 'アイデアを、本当に使いやすいウェブサイトに。', '아이디어를 정말 유용한 웹사이트로 만듭니다.'],
    '功能開發 × 商業流程 × 技術研究': ['Feature development × Business workflows × Technical research', '機能開発 × 業務フロー × 技術研究', '기능 개발 × 비즈니스 프로세스 × 기술 연구'],
    '從網站、訂單與預約，到 API 串接與自動化；把實際需求整理成清楚、可使用的數位工具。': ['From websites, orders, and bookings to API integrations and automation: turning real needs into clear, usable digital tools.', 'ウェブサイト、注文・予約管理、API連携、自動化まで。実際のニーズを、分かりやすく使えるデジタルツールにします。', '웹사이트, 주문과 예약부터 API 연동과 자동화까지, 실제 요구를 명확하고 사용하기 쉬운 디지털 도구로 만듭니다.'],
    '看看作品與合作方式 →': ['Explore my work & ways to collaborate →', '制作実績とご相談の流れを見る →', '작품과 협업 방식 살펴보기 →'],
    '不只展示，': ['Not just for show—', '見せるだけでなく、', '보여 주는 데 그치지 않고,'],
    '也解決問題。': ['built to solve problems.', '課題も解決します。', '문제도 해결합니다.'],
    '影像服務的數位工作流程': ['Digital workflows for imaging services', '画像サービスのデジタル業務フロー', '이미지 서비스의 디지털 업무 흐름'],
    '從服務介紹、線上下單到門市作業，串起不同的使用情境。': ['Connecting service information, online orders, and in-store operations across different use cases.', 'サービス紹介、オンライン注文、店舗業務まで、さまざまな利用場面をつなぎます。', '서비스 소개, 온라인 주문, 매장 업무까지 다양한 사용 상황을 연결합니다.'],
    '咖啡店的線上點餐體驗': ['An online ordering experience for a café', 'カフェのオンライン注文体験', '카페의 온라인 주문 경험'],
    '菜單、客製選項、桌位 QR 與訂位流程，從手機操作開始設計。': ['Menus, customizations, table QR codes, and reservations designed around mobile use.', 'メニュー、カスタマイズ、テーブルのQRコード、予約フローを、スマートフォンでの操作から設計します。', '메뉴, 맞춤 옵션, 테이블 QR 코드, 예약 과정을 모바일 사용부터 설계합니다.'],
    '了解功能與架構 →': ['Explore features & architecture →', '機能と構成を見る →', '기능과 구조 살펴보기 →'],
    '了解作品與功能 →': ['Explore the project & features →', '制作実績と機能を見る →', '작품과 기능 살펴보기 →'],
    '最近的開發筆記、研究與實作觀察；先從你有興趣的主題開始。': ['Recent development notes, research, and practical observations. Start with a topic that interests you.', '最近の開発ノート、研究、実装から得た気づき。興味のあるテーマからどうぞ。', '최근 개발 노트, 연구, 구현에서 얻은 관찰입니다. 관심 있는 주제부터 읽어 보세요.'],
    '語言': ['Language', '言語', '언어'],
    '跟隨系統': ['Follow system', 'システム設定に合わせる', '시스템 설정 따르기'],
    '匿名回覆牆': ['Anonymous reply wall', '匿名回答一覧', '익명 답변 게시판'],
    '只保留問題與回覆，不公開姓名、Email、IP 或安全稽核資訊。想問新問題，請統一使用網站匿名版。': ['Only questions and answers are public, never names, email addresses, IP addresses, or security audit data. Use the anonymous form to ask a new question.', '公開するのは質問と回答だけです。名前、メールアドレス、IP、安全監査情報は公開しません。新しい質問は匿名フォームからどうぞ。', '질문과 답변만 공개하며 이름, 이메일, IP, 보안 감사 정보는 공개하지 않습니다. 새 질문은 익명 양식을 이용해 주세요.'],
    '匿名回覆分頁': ['Anonymous reply pages', '匿名回答のページ', '익명 답변 페이지'],
    '搜尋本頁問答': ['Search this page', 'このページの質問・回答を検索', '이 페이지 질문과 답변 검색'],
    '搜尋問題或回覆': ['Search questions or answers', '質問または回答を検索', '질문 또는 답변 검색'],
    '只篩選目前載入的 8 則以內問答；不會搜尋其他分頁。問題與回覆保留原文。': ['Filters only the up to 8 answers loaded on this page, not other pages. Questions and answers stay in their original language.', '現在のページに読み込まれた最大8件だけを絞り込みます。他のページは検索しません。質問と回答は原文のままです。', '현재 페이지에 불러온 최대 8개 답변만 필터링하며 다른 페이지는 검색하지 않습니다. 질문과 답변은 원문을 유지합니다.'],
    '回覆篩選': ['Filter answers', '回答の絞り込み', '답변 필터'],
    '全部回覆': ['All answers', 'すべての回答', '모든 답변'],
    '長回覆': ['Long answers', '長い回答', '긴 답변'],
    '清除篩選': ['Clear filters', '絞り込みを解除', '필터 지우기'],
    '本頁顯示 {visible} / {loaded} 則；共 {total} 則回覆': ['Showing {visible} of {loaded} on this page; {total} answers total', 'このページは{loaded}件中{visible}件を表示・全{total}件', '이 페이지 {loaded}개 중 {visible}개 표시 · 전체 답변 {total}개'],
    '提問 {number}': ['Question {number}', '質問 {number}', '질문 {number}'],
    '匿名提問': ['Anonymous question', '匿名の質問', '익명 질문'],
    'BoyceLab 回覆': ['BoyceLab answer', 'BoyceLabの回答', 'BoyceLab 답변'],
    '展開完整問題': ['Read full question', '質問の全文を読む', '질문 전체 보기'],
    '收合問題': ['Collapse question', '質問を折りたたむ', '질문 접기'],
    '展開完整回覆': ['Read full answer', '回答の全文を読む', '답변 전체 보기'],
    '收合回覆': ['Collapse answer', '回答を折りたたむ', '답변 접기'],
    '送出第一個問題': ['Ask the first question', '最初の質問を送る', '첫 질문 보내기'],
    '第一則公開回覆正在準備中': ['The first public answer is on its way', '最初の公開回答を準備しています', '첫 공개 답변을 준비 중입니다'],
    '歡迎先送出匿名問題。': ['You are welcome to send an anonymous question.', '匿名の質問をお待ちしています。', '익명 질문을 보내 주세요.'],
    '沒有符合的問答': ['No matching questions or answers', '一致する質問・回答はありません', '일치하는 질문이나 답변이 없습니다'],
    '請換個關鍵字、清除篩選，或前往其他分頁。': ['Try another keyword, clear the filters, or browse another page.', '別のキーワードを試すか、絞り込みを解除するか、他のページをご覧ください。', '다른 검색어를 사용하거나 필터를 지우거나 다른 페이지를 확인해 주세요.'],
    '目前無法載入公開回覆': ['Public answers could not be loaded', '公開回答を読み込めませんでした', '공개 답변을 불러올 수 없습니다'],
    '請檢查網路後重新載入。': ['Check your connection and try again.', '接続を確認して再読み込みしてください。', '연결을 확인하고 다시 시도해 주세요.'],
    '正在載入公開問答': ['Loading public questions and answers', '公開の質問・回答を読み込み中', '공개 질문과 답변 불러오는 중'],
    '只顯示已公開的問題與回覆。': ['Only published questions and answers are shown.', '公開済みの質問と回答だけを表示します。', '공개된 질문과 답변만 표시합니다.'],
    '載入中…': ['Loading…', '読み込み中…', '불러오는 중…'],
    '重新載入': ['Try again', '再読み込み', '다시 시도'],
    '暫時無法載入': ['Temporarily unavailable', '現在読み込めません', '일시적으로 불러올 수 없음'],
    '上一頁': ['Previous', '前へ', '이전'],
    '下一頁': ['Next', '次へ', '다음'],
    '前往上一頁': ['Go to previous page', '前のページへ', '이전 페이지로'],
    '前往下一頁': ['Go to next page', '次のページへ', '다음 페이지로'],
    '前往第 {page} 頁': ['Go to page {page}', '{page}ページへ', '{page}페이지로'],
    '文章翻譯': ['Article translation', '記事の翻訳', '글 번역'],
    '文章保留原文': ['Original article preserved', '記事は原文のままです', '글 원문 유지'],
    '介面語言不會自動翻譯文章。選擇目標語言並按下翻譯，才會將文章文字傳送到 Cloudflare AI。': ['Changing the interface language does not translate the article. Article text is sent to Cloudflare AI only when you choose a language and press Translate.', '表示言語を変えても記事は翻訳しません。翻訳先を選んで翻訳ボタンを押したときだけ、記事のテキストをCloudflare AIに送信します。', '인터페이스 언어를 바꿔도 글은 번역하지 않습니다. 대상 언어를 선택하고 번역 버튼을 누를 때만 글 텍스트를 Cloudflare AI로 전송합니다.'],
    '翻譯成': ['Translate into', '翻訳先', '번역 대상'],
    '翻譯這篇文章': ['Translate this article', 'この記事を翻訳', '이 글 번역'],
    '正在翻譯文章（{done} / {total}）': ['Translating this article ({done} / {total})', '記事を翻訳中（{done} / {total}）', '글 번역 중 ({done} / {total})'],
    '原文仍可閱讀。首次翻譯可能需要一些時間，也可以取消。': ['The original stays readable. The first translation can take some time; you can cancel it.', '原文は引き続き読めます。初回の翻訳には時間がかかる場合があります。キャンセルもできます。', '원문은 계속 읽을 수 있습니다. 첫 번역은 시간이 걸릴 수 있으며 취소할 수 있습니다.'],
    '取消翻譯': ['Cancel translation', '翻訳をキャンセル', '번역 취소'],
    '機器翻譯版本': ['Machine-translated version', '機械翻訳版', '기계 번역본'],
    'AI 翻譯可能有誤或不完整，請以原文為準。程式碼、連結與圖片保持原樣。': ['AI translation may be inaccurate or incomplete. Refer to the original; code, links, and images are unchanged.', 'AI翻訳には誤りや未翻訳部分がある場合があります。原文を確認してください。コード・リンク・画像は変更しません。', 'AI 번역은 부정확하거나 불완전할 수 있습니다. 원문을 참고해 주세요. 코드, 링크, 이미지는 변경하지 않습니다.'],
    '查看原文': ['View original', '原文を見る', '원문 보기'],
    '查看翻譯': ['View translation', '翻訳を見る', '번역 보기'],
    '翻譯未能完成': ['Translation could not be completed', '翻訳できませんでした', '번역을 완료할 수 없습니다'],
    '原文完整保留。請稍後再試。': ['The original is preserved. Please try again later.', '原文はそのまま残っています。後でもう一度お試しください。', '원문은 그대로 유지됩니다. 나중에 다시 시도해 주세요.'],
    '已完成 {done} / {total} 個部分。原文完整保留；重新嘗試會接續已完成的部分。': ['Completed {done} of {total} parts. The original is preserved; retrying resumes from the completed parts.', '{total}部分中{done}部分が完了しました。原文はそのままです。再試行すると完了済み部分から再開します。', '{total}개 부분 중 {done}개를 완료했습니다. 원문은 그대로 유지되며 다시 시도하면 완료한 부분부터 이어집니다.'],
    '翻譯時間較長，已停止等待；原文仍可閱讀。': ['The translation timed out. The original remains readable.', '翻訳がタイムアウトしました。原文は引き続き読めます。', '번역 시간이 초과되었습니다. 원문은 계속 읽을 수 있습니다.'],
    '重新嘗試翻譯': ['Retry translation', '翻訳を再試行', '번역 다시 시도']
  };
  Object.entries(interfaceCopy).forEach(([original, values]) => {
    ['en', 'ja', 'ko'].forEach((language, index) => { translations[language][original] = values[index]; });
  });

  translations['zh-TW'] = Object.fromEntries(Object.keys(translations.en).map(original => [original, original]));
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  const SKIP_INTERFACE = 'script,style,pre,code,kbd,samp,svg,math,[data-i18n-skip],[translate="no"],.article-type-post:not(.article-index-card) .article-entry,.article-title,.article-comment-body > p,.article-comment-meta > strong,.article-comment-avatar,.friend-name,.friend-description,.chat-message-content';
  const originalDocumentTitle = document.title;
  let preference = choosePreference();
  let locale = resolveLocale(preference);
  let articleTitleOverride = null;
  let started = false;
  document.documentElement.lang = locale;
  window.BoyceI18n = {
    get locale() { return locale; },
    get preference() { return preference; },
    t: translate,
    setLocale,
    apply: applyTranslations
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  function start() {
    if (started) return;
    started = true;
    createSwitcher();
    applyTranslations(document.body);
    updateDocumentTitle();
    initializeArticleTranslation();
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'characterData') applyTranslations(record.target);
        else if (record.type === 'attributes') applyAttributes(record.target);
        else for (const node of record.addedNodes) applyTranslations(node);
      }
    });
    observer.observe(document.body, {
      childList: true, characterData: true, subtree: true,
      attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title']
    });
    window.addEventListener('languagechange', () => {
      if (preference === 'auto') activatePreference('auto');
    });
    window.addEventListener('storage', event => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const query = normalizePreference(new URLSearchParams(location.search).get('lang'));
      if (!query) activatePreference(choosePreference());
    });
    window.addEventListener('popstate', () => activatePreference(choosePreference()));
    notifyLanguageChange(null);
  }

  function normalizeLocale(value) {
    const input = String(value || '').toLowerCase().replace(/_/g, '-');
    if (input === 'zh' || input.startsWith('zh-')) return 'zh-TW';
    return ['en', 'ja', 'ko'].find(code => input === code || input.startsWith(`${code}-`)) || null;
  }

  function normalizePreference(value) {
    return String(value || '').toLowerCase() === 'auto' ? 'auto' : normalizeLocale(value);
  }

  function choosePreference() {
    const query = normalizePreference(new URLSearchParams(location.search).get('lang'));
    if (query) return query;
    try {
      const stored = normalizePreference(localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch (_) {}
    return 'auto';
  }

  function resolveLocale(value) {
    if (value !== 'auto') return value;
    for (const language of [...(navigator.languages || []), navigator.language]) {
      const normalized = normalizeLocale(language);
      if (normalized) return normalized;
    }
    return 'zh-TW';
  }

  function notifyLanguageChange(previousLocale) {
    window.dispatchEvent(new CustomEvent('boycelab:languagechange', { detail: { locale, preference, previousLocale } }));
  }

  function activatePreference(nextPreference) {
    const previousLocale = locale;
    const previousPreference = preference;
    preference = nextPreference;
    locale = resolveLocale(preference);
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-language-select]').forEach(select => {
      select.value = preference;
      select.setAttribute('aria-label', translate('語言'));
      const automatic = select.querySelector('option[value="auto"]');
      if (automatic) automatic.textContent = translate('跟隨系統');
    });
    if (!started || (previousLocale === locale && previousPreference === preference)) return;
    applyTranslations(document.body);
    updateDocumentTitle();
    notifyLanguageChange(previousLocale);
  }

  function setLocale(nextLocale) {
    const normalized = normalizePreference(nextLocale);
    if (!normalized) return false;
    try { localStorage.setItem(STORAGE_KEY, normalized); } catch (_) {}
    try {
      document.cookie = `${STORAGE_KEY}=${encodeURIComponent(normalized)}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch (_) {}
    const url = new URL(location.href);
    url.searchParams.set('lang', normalized);
    window.history.replaceState(window.history.state, '', url);
    activatePreference(normalized);
    return true;
  }

  function createSwitcher() {
    if (document.querySelector('[data-language-select]')) return;
    const host = document.getElementById('sub-nav') || document.body;
    const control = document.createElement('div');
    control.className = `site-language-control${host === document.body ? ' floating' : ''}`;
    control.setAttribute('data-i18n-skip', '');
    const glyph = document.createElement('span');
    glyph.className = 'site-language-glyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = '文';
    const select = document.createElement('select');
    select.className = 'site-language-select';
    select.setAttribute('data-language-select', '');
    select.setAttribute('aria-label', translate('語言'));
    ['auto', ...SUPPORTED].forEach(code => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = code === 'auto' ? translate('跟隨系統') : LABELS[code][1];
      option.lang = code === 'auto' ? locale : code;
      select.appendChild(option);
    });
    select.value = preference;
    const chevron = document.createElement('span');
    chevron.className = 'site-language-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    control.append(glyph, select, chevron);
    host.insertBefore(control, host.firstChild);
    select.addEventListener('change', event => setLocale(event.currentTarget.value));
  }

  function translate(text, values = {}) {
    const template = translations[locale]?.[text] || String(text);
    return template.replace(/\{([^{}]+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match);
  }

  function updateDocumentTitle() {
    document.title = originalDocumentTitle.split(' | ').map(part => {
      if (articleTitleOverride && part === articleTitleOverride.original) return articleTitleOverride.current;
      return translate(part);
    }).join(' | ');
  }

  function applyText(node) {
    if (!node.nodeValue.trim() || node.parentElement?.closest(`${SKIP_INTERFACE},textarea`)) return;
    const previous = textSources.get(node);
    const original = previous && previous.rendered === node.nodeValue ? previous.original : node.nodeValue;
    const text = original.trim();
    const rendered = original.replace(text, translate(text));
    textSources.set(node, { original, rendered });
    if (node.nodeValue !== rendered) node.nodeValue = rendered;
  }

  function applyAttributes(element) {
    if (element.closest?.(SKIP_INTERFACE)) return;
    const sources = attributeSources.get(element) || new Map();
    for (const attribute of ['placeholder', 'aria-label', 'title']) {
      const current = element.getAttribute(attribute);
      if (current === null) {
        sources.delete(attribute);
        continue;
      }
      const previous = sources.get(attribute);
      const original = previous && previous.rendered === current ? previous.original : current;
      const rendered = translate(original);
      sources.set(attribute, { original, rendered });
      if (current !== rendered) element.setAttribute(attribute, rendered);
    }
    attributeSources.set(element, sources);
  }

  function applyTranslations(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      applyText(root);
      return;
    }
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE, Node.DOCUMENT_NODE].includes(root.nodeType)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) applyText(walker.currentNode);
    if (root.nodeType === Node.ELEMENT_NODE) applyAttributes(root);
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(applyAttributes);
  }

  function initializeArticleTranslation() {
    if (!/^\/(?:20[0-9]{2}\/[0-9]{2}\/[0-9]{2}|articles)\/[A-Za-z0-9%._~-]+\/$/.test(location.pathname)) return;
    const article = document.querySelector('.article-type-post:not(.article-index-card) .article-entry, .cms-public-content');
    const title = document.querySelector('.article-type-post:not(.article-index-card) .article-title, .cms-public-header h1');
    if (!article || !title || document.querySelector('.article-machine-translation')) return;
    const sourceLocale = normalizeLocale(article.dataset.sourceLocale) || 'zh-TW';
    const originalTitle = title.textContent.trim();
    const titleNodes = collectTextNodes(title);
    const cache = new Map();
    const partCache = new Map();
    let entries = [];
    let chunks = [];
    let completedParts = 0;
    let state = 'original';
    let timedOut = false;
    let requestSequence = 0;
    let controller = null;

    const notice = document.createElement('aside');
    notice.className = 'article-machine-translation';
    notice.setAttribute('data-i18n-skip', '');
    const pulse = document.createElement('span');
    pulse.className = 'translation-pulse';
    pulse.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div');
    copy.className = 'translation-copy';
    copy.setAttribute('role', 'status');
    copy.setAttribute('aria-live', 'polite');
    copy.setAttribute('aria-atomic', 'true');
    const statusTitle = document.createElement('strong');
    const statusBody = document.createElement('p');
    copy.append(statusTitle, statusBody);
    const actions = document.createElement('div');
    actions.className = 'translation-actions';
    const targetLabel = document.createElement('label');
    targetLabel.className = 'translation-target';
    const targetCopy = document.createElement('span');
    const target = document.createElement('select');
    target.setAttribute('data-translation-target', '');
    SUPPORTED.filter(code => code !== sourceLocale).forEach(code => {
      const option = document.createElement('option');
      option.value = code;
      option.lang = code;
      option.textContent = LABELS[code][1];
      target.appendChild(option);
    });
    target.value = locale !== sourceLocale ? locale : SUPPORTED.find(code => code !== sourceLocale);
    targetLabel.append(targetCopy, target);
    const translateButton = document.createElement('button');
    translateButton.type = 'button';
    translateButton.setAttribute('data-translation-request', '');
    const originalButton = document.createElement('button');
    originalButton.type = 'button';
    originalButton.setAttribute('data-translation-toggle', '');
    actions.append(targetLabel, translateButton, originalButton);
    notice.append(pulse, copy, actions);
    article.before(notice);
    article.lang = sourceLocale;
    title.lang = sourceLocale;
    articleTitleOverride = { original: originalTitle, current: originalTitle };
    updateDocumentTitle();

    function update() {
      notice.classList.toggle('loading', state === 'loading');
      notice.classList.toggle('error', state === 'error');
      notice.setAttribute('aria-label', translate('文章翻譯'));
      statusTitle.textContent = translate(state === 'loading' ? '正在翻譯文章（{done} / {total}）' : state === 'translated' ? '機器翻譯版本' : state === 'error' ? '翻譯未能完成' : '文章保留原文', { done: completedParts, total: chunks.length });
      statusBody.textContent = translate(state === 'loading' ? '原文仍可閱讀。首次翻譯可能需要一些時間，也可以取消。' : state === 'translated' ? 'AI 翻譯可能有誤或不完整，請以原文為準。程式碼、連結與圖片保持原樣。' : state === 'error' ? timedOut ? '翻譯時間較長，已停止等待；原文仍可閱讀。' : '原文完整保留。請稍後再試。' : '介面語言不會自動翻譯文章。選擇目標語言並按下翻譯，才會將文章文字傳送到 Cloudflare AI。');
      if (state === 'error' && chunks.length) statusBody.textContent += ` ${translate('已完成 {done} / {total} 個部分。原文完整保留；重新嘗試會接續已完成的部分。', { done: completedParts, total: chunks.length })}`;
      targetCopy.textContent = translate('翻譯成');
      translateButton.textContent = translate(state === 'error' ? '重新嘗試翻譯' : cache.has(target.value) ? '查看翻譯' : '翻譯這篇文章');
      translateButton.disabled = state === 'loading' || state === 'translated';
      originalButton.hidden = state !== 'loading' && state !== 'translated';
      originalButton.textContent = translate(state === 'loading' ? '取消翻譯' : '查看原文');
      article.dataset.machineTranslation = state === 'translated' ? 'ready' : state;
    }

    function restoreOriginal() {
      requestSequence += 1;
      controller?.abort();
      controller = null;
      entries.forEach(entry => { entry.node.nodeValue = entry.original; });
      titleNodes.forEach(entry => { entry.node.nodeValue = entry.original; });
      article.lang = sourceLocale;
      title.lang = sourceLocale;
      articleTitleOverride.current = originalTitle;
      state = 'original';
      updateDocumentTitle();
      update();
      notifyArticleChange();
    }

    function notifyArticleChange() {
      window.dispatchEvent(new CustomEvent('boycelab:articletranslationchange', { detail: { state, locale: article.lang, targetLocale: target.value } }));
    }

    function showTranslation(translation, language) {
      if (entries.some(entry => !article.contains(entry.node))) throw new Error('Article content changed');
      entries.forEach((entry, index) => { entry.node.nodeValue = translation.text[index]; });
      const translatedTitle = translations[language]?.[originalTitle] || translation.title;
      titleNodes.forEach((entry, index) => { entry.node.nodeValue = index === 0 ? translatedTitle : ''; });
      article.lang = language;
      title.lang = language;
      articleTitleOverride.current = translatedTitle;
      state = 'translated';
      updateDocumentTitle();
      update();
      notifyArticleChange();
    }

    async function translateChunk(chunk, index, language, signal) {
      const chunkController = new AbortController();
      const cancel = () => chunkController.abort();
      signal.addEventListener('abort', cancel, { once: true });
      if (signal.aborted) cancel();
      const timer = window.setTimeout(cancel, 90_000);
      try {
        const description = index === 0 ? document.querySelector('meta[name="description"]')?.content || '' : '';
        const apiBase = (window.BoyceApiConfig?.baseUrl || window.BoyceBackend?.baseUrl || 'https://api.boycelab.com').replace(/\/$/, '');
        const path = `${location.pathname.replace(/\/$/, '')}--bl-part-${String(index + 1).padStart(3, '0')}/`;
        const response = await fetch(`${apiBase}/translate/article`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            article_key: `path:${path}`, source_locale: sourceLocale, target_locale: language,
            title: originalTitle, excerpt: description,
            content_html: chunk.map(part => `<p>${escapeHtmlText(part.text)}</p>`).join(''),
            seo_title: originalTitle, seo_description: description
          }),
          credentials: 'omit', cache: 'no-store',
          referrerPolicy: 'strict-origin-when-cross-origin', signal: chunkController.signal
        });
        const payload = await response.json();
        if (chunkController.signal.aborted) throw new DOMException('Translation cancelled', 'AbortError');
        const result = payload?.translation;
        if (!response.ok || result?.source_locale !== sourceLocale || result?.target_locale !== language || typeof result?.content_html !== 'string' || result.content_html.length > 1_500_000) throw new Error('Invalid translation response');
        const template = document.createElement('template');
        template.innerHTML = result.content_html;
        const paragraphs = Array.from(template.content.childNodes).filter(node => node.nodeType !== Node.TEXT_NODE || node.nodeValue.trim());
        if (paragraphs.length !== chunk.length || paragraphs.some(node => node.nodeType !== Node.ELEMENT_NODE || node.localName !== 'p' || node.attributes.length || Array.from(node.childNodes).some(child => child.nodeType !== Node.TEXT_NODE))) throw new Error('Translation structure changed');
        return { title: typeof result.title === 'string' && result.title.trim() ? result.title : originalTitle, text: paragraphs.map(node => node.textContent) };
      } finally {
        window.clearTimeout(timer);
        signal.removeEventListener('abort', cancel);
      }
    }

    async function requestTranslation() {
      if (state === 'loading' || state === 'translated') return;
      const language = target.value;
      const sequence = ++requestSequence;
      const activeController = new AbortController();
      controller = activeController;
      state = 'loading';
      timedOut = false;
      try {
        if (!entries.length) {
          entries = collectTextNodes(article, 'script,style,pre,code,kbd,samp,svg,math,form,button,input,textarea,select,iframe,[data-i18n-skip],[translate="no"],.highlight,.katex,.MathJax,.mermaid,.hbe-input,.hbe-data');
          chunks = createTranslationChunks(article, entries);
        }
        if (!entries.length) throw new Error('No article text');
        if (cache.has(language)) {
          showTranslation(cache.get(language), language);
          return;
        }
        const completed = partCache.get(language) || new Map();
        partCache.set(language, completed);
        completedParts = completed.size;
        update();
        let nextIndex = 0;
        async function worker() {
          while (nextIndex < chunks.length && !activeController.signal.aborted) {
            const index = nextIndex++;
            if (completed.has(index)) continue;
            const translated = await translateChunk(chunks[index], index, language, activeController.signal);
            if (sequence !== requestSequence || activeController.signal.aborted) return;
            completed.set(index, translated);
            completedParts = completed.size;
            update();
          }
        }
        await Promise.all(Array.from({ length: Math.min(2, chunks.length) }, worker));
        if (sequence !== requestSequence || activeController.signal.aborted) return;
        if (completed.size !== chunks.length) throw new Error('Incomplete article translation');
        const text = entries.map(() => '');
        chunks.forEach((chunk, index) => {
          chunk.forEach((part, partIndex) => { text[part.entryIndex] += completed.get(index).text[partIndex]; });
        });
        const translation = { title: completed.get(0).title, text };
        showTranslation(translation, language);
        cache.set(language, translation);
      } catch (error) {
        if (sequence !== requestSequence) return;
        activeController.abort();
        state = 'error';
        timedOut = error?.name === 'AbortError';
        update();
      } finally {
        if (sequence === requestSequence) controller = null;
      }
    }

    translateButton.addEventListener('click', requestTranslation);
    originalButton.addEventListener('click', restoreOriginal);
    target.addEventListener('change', () => {
      restoreOriginal();
      requestTranslation();
    });
    window.addEventListener('boycelab:languagechange', event => {
      if (event.detail.previousLocale === null || event.detail.previousLocale === locale) return;
      restoreOriginal();
      target.value = locale !== sourceLocale ? locale : SUPPORTED.find(code => code !== sourceLocale);
      update();
      if (locale !== sourceLocale) requestTranslation();
    });
    update();
    if (locale !== sourceLocale) requestTranslation();
  }

  function collectTextNodes(root, skipSelector = '') {
    const entries = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.nodeValue.trim() || (skipSelector && node.parentElement?.closest(skipSelector))) continue;
      entries.push({ node, original: node.nodeValue });
    }
    return entries;
  }

  function createTranslationChunks(article, entries) {
    const chunks = [];
    let chunk = [];
    let characters = 0;
    let topLevelNodes = new Set();
    entries.forEach((entry, entryIndex) => {
      let topLevel = entry.node;
      while (topLevel.parentNode && topLevel.parentNode !== article) topLevel = topLevel.parentNode;
      const source = Array.from(entry.original);
      let offset = 0;
      while (offset < source.length) {
        let end = Math.min(source.length, offset + 2000);
        if (end < source.length) {
          for (let boundary = end; boundary > offset + 1000; boundary -= 1) {
            if (/[。！？.!?\s]/u.test(source[boundary - 1])) {
              end = boundary;
              break;
            }
          }
        }
        const text = source.slice(offset, end).join('');
        if (chunk.length && (characters + text.length > 8000 || chunk.length >= 24 || (!topLevelNodes.has(topLevel) && topLevelNodes.size >= 8))) {
          chunks.push(chunk);
          chunk = [];
          characters = 0;
          topLevelNodes = new Set();
        }
        chunk.push({ entryIndex, text });
        characters += text.length;
        topLevelNodes.add(topLevel);
        offset = end;
      }
    });
    if (chunk.length) chunks.push(chunk);
    return chunks;
  }

  function escapeHtmlText(value) {
    return value.replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
  }
})();
