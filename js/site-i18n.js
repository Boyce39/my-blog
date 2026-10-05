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
    '開啟導覽選單': ['Open navigation', 'メニューを開く', '메뉴 열기']
  };
  Object.entries(interfaceCopy).forEach(([original, values]) => {
    ['en', 'ja', 'ko'].forEach((language, index) => { translations[language][original] = values[index]; });
  });

  const locale = chooseLocale();
  document.documentElement.lang = locale;
  window.BoyceI18n = { locale, t: translate, setLocale, apply: applyTranslations };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  function start() {
    createSwitcher();
    applyTranslations(document.body);
    document.title = document.title.split(' | ').map(part => translate(part)).join(' | ');
    translateStaticArticle().catch(error => console.warn('Article translation unavailable', error));
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
    document.documentElement.classList.add('language-switching');
    document.querySelectorAll('[data-language-select]').forEach(select => { select.disabled = true; });
    window.location.assign(url.toString());
  }

  function createSwitcher() {
    const host = document.getElementById('sub-nav') || document.body;
    const control = document.createElement('div');
    control.className = `site-language-control${host === document.body ? ' floating' : ''}`;
    control.innerHTML = `<span class="site-language-glyph" aria-hidden="true">文</span><select class="site-language-select" data-language-select aria-label="Language / 語言">${SUPPORTED.map(code => `<option value="${code}"${code === locale ? ' selected' : ''}>${LABELS[code][1]}</option>`).join('')}</select><span class="site-language-chevron" aria-hidden="true"></span>`;
    if (host === document.body) host.appendChild(control);
    else host.insertBefore(control, host.firstChild);
    control.querySelector('select').addEventListener('change', event => setLocale(event.currentTarget.value));
  }

  function translate(text) {
    return locale === 'zh-TW' ? text : translations[locale]?.[text] || text;
  }

  function applyTranslations(root) {
    if (locale === 'zh-TW' || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest('script,style,pre,code,[data-i18n-skip],.article-type-post:not(.article-index-card) .article-entry,.article-title')) return NodeFilter.FILTER_REJECT;
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

  async function translateStaticArticle() {
    if (locale === 'zh-TW' || !/^\/20[0-9]{2}\/[0-9]{2}\/[0-9]{2}\/[A-Za-z0-9%._~-]+\/$/.test(location.pathname)) return;
    const article = document.querySelector('.article-entry');
    const title = document.querySelector('.article-title');
    if (!article || !title || article.dataset.machineTranslation === 'ready') return;

    const original = {
      title: title.textContent.trim(),
      html: article.innerHTML,
      documentTitle: document.title
    };
    const copy = articleTranslationCopy(locale);
    const notice = document.createElement('aside');
    notice.className = 'article-machine-translation loading';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.innerHTML = `<span class="translation-pulse" aria-hidden="true"></span><div class="translation-copy"><strong>${copy.loadingTitle}</strong><p>${copy.loadingBody}</p></div><div class="translation-actions"><button type="button" data-translation-toggle hidden>${copy.showOriginal}</button><button type="button" data-translation-retry hidden>${copy.retry}</button></div>`;
    article.before(notice);

    const statusTitle = notice.querySelector('strong');
    const statusBody = notice.querySelector('p');
    const toggle = notice.querySelector('[data-translation-toggle]');
    const retry = notice.querySelector('[data-translation-retry]');
    let translated = null;
    let responseWasCached = false;
    let showingOriginal = false;
    let requestInFlight = false;

    const requestTranslation = async () => {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 90_000);
      const apiBase = window.BoyceApiConfig?.baseUrl || 'https://api.boycelab.com';
      const description = document.querySelector('meta[name="description"]')?.content || '';
      try {
        const response = await fetch(`${apiBase}/translate/article`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            article_key: `path:${location.pathname}`,
            source_locale: 'zh-TW',
            target_locale: locale,
            title: original.title,
            excerpt: description,
            content_html: original.html,
            seo_title: original.title,
            seo_description: description
          }),
          credentials: 'omit',
          referrerPolicy: 'strict-origin-when-cross-origin',
          signal: controller.signal
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.translation?.content_html) throw new Error(payload.error || `Translation failed (${response.status})`);
        return payload;
      } finally {
        window.clearTimeout(timer);
      }
    };

    const applyTranslated = () => {
      const translatedTitle = translated.title || original.title;
      title.textContent = translatedTitle;
      article.innerHTML = translated.content_html;
      hydrateTranslatedImages(article);
      document.title = original.documentTitle.replace(original.title, translatedTitle);
      toggle.textContent = copy.showOriginal;
      statusTitle.textContent = copy.readyTitle;
      statusBody.textContent = responseWasCached ? copy.cachedBody : copy.readyBody;
      showingOriginal = false;
    };
    const applyOriginal = () => {
      title.textContent = original.title;
      article.innerHTML = original.html;
      hydrateTranslatedImages(article);
      document.title = original.documentTitle;
      toggle.textContent = copy.showTranslation;
      statusTitle.textContent = copy.originalTitle;
      statusBody.textContent = copy.originalBody;
      showingOriginal = true;
    };
    const runTranslation = async () => {
      if (requestInFlight) return;
      requestInFlight = true;
      notice.classList.remove('error');
      notice.classList.add('loading');
      statusTitle.textContent = copy.loadingTitle;
      statusBody.textContent = copy.loadingBody;
      toggle.hidden = true;
      retry.hidden = true;
      retry.disabled = true;
      try {
        const payload = await requestTranslation();
        translated = payload.translation;
        responseWasCached = Boolean(payload.cached);
        article.dataset.machineTranslation = 'ready';
        notice.classList.remove('loading');
        toggle.hidden = false;
        applyTranslated();
      } catch (error) {
        notice.classList.remove('loading');
        notice.classList.add('error');
        statusTitle.textContent = copy.errorTitle;
        statusBody.textContent = error?.name === 'AbortError' ? copy.timeoutBody : copy.errorBody;
        retry.hidden = false;
        retry.disabled = false;
        console.warn('Article translation unavailable', error);
      } finally {
        requestInFlight = false;
      }
    };

    toggle.addEventListener('click', () => showingOriginal ? applyTranslated() : applyOriginal());
    retry.addEventListener('click', runTranslation);
    await runTranslation();
  }

  function hydrateTranslatedImages(root) {
    root.querySelectorAll('img[data-original]').forEach(image => {
      if (image.dataset.original) image.src = image.dataset.original;
    });
  }

  function articleTranslationCopy(activeLocale) {
    return {
      en: { loadingTitle: 'Translating this article', loadingBody: 'Cloudflare AI is preparing an English version. Longer articles can take a little longer the first time.', readyTitle: 'Machine-translated article', readyBody: 'Translated automatically by Cloudflare AI. Technical names and code are kept intact.', cachedBody: 'Loaded instantly from the edge translation cache.', showOriginal: 'View original', showTranslation: 'View translation', originalTitle: 'Original article', originalBody: 'You are reading the author’s original Traditional Chinese version.', errorTitle: 'Translation could not be completed', errorBody: 'The original article is still available. You can retry without leaving this page.', timeoutBody: 'This translation took longer than expected. The original remains available, and you can retry now.', retry: 'Retry translation' },
      ja: { loadingTitle: '記事を翻訳しています', loadingBody: 'Cloudflare AIが日本語版を準備しています。長い記事の初回翻訳には少し時間がかかります。', readyTitle: '自動翻訳された記事', readyBody: 'Cloudflare AIによる自動翻訳です。技術名とコードは原文のまま保持します。', cachedBody: 'エッジ翻訳キャッシュからすぐに読み込みました。', showOriginal: '原文を見る', showTranslation: '翻訳を見る', originalTitle: '原文を表示中', originalBody: '作者が書いた繁体字中国語の原文を表示しています。', errorTitle: '翻訳を完了できませんでした', errorBody: '原文はそのまま閲覧できます。このページから再試行できます。', timeoutBody: '翻訳に通常より時間がかかりました。原文を読みながら、もう一度お試しいただけます。', retry: '翻訳を再試行' },
      ko: { loadingTitle: '글을 번역하는 중입니다', loadingBody: 'Cloudflare AI가 한국어 버전을 준비하고 있습니다. 긴 글의 첫 번역은 조금 더 걸릴 수 있습니다.', readyTitle: '자동 번역된 글', readyBody: 'Cloudflare AI로 자동 번역했습니다. 기술 용어와 코드는 원문을 유지합니다.', cachedBody: '엣지 번역 캐시에서 바로 불러왔습니다.', showOriginal: '원문 보기', showTranslation: '번역 보기', originalTitle: '원문을 표시 중입니다', originalBody: '작성자의 번체 중국어 원문을 표시하고 있습니다.', errorTitle: '번역을 완료하지 못했습니다', errorBody: '원문은 계속 읽을 수 있으며 이 페이지에서 바로 다시 시도할 수 있습니다.', timeoutBody: '번역 시간이 예상보다 길어졌습니다. 원문을 읽으면서 다시 시도할 수 있습니다.', retry: '번역 다시 시도' }
    }[activeLocale];
  }
})();
