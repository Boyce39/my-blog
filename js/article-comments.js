(() => {
  'use strict';

  const root = document.getElementById('article-comments');
  if (!root) return;

  const API_BASE_URL = window.BoyceApiConfig?.baseUrl || 'https://api.boycelab.com';
  const PAGE_SIZE = 10;
  const NAME_STORAGE_KEY = 'boycelab_article_comment_name';
  const PAGE_QUERY_KEY = 'comment_page';
  const locale = window.BoyceI18n?.locale || 'zh-TW';
  const messages = {
    'zh-TW': { required: '請填寫顯示名稱與留言內容。', sending: '正在送出留言…', sendFailed: '留言送出失敗', duplicate: '這則留言已經送出，不會重複顯示。', success: '留言已公開，謝謝你的回應！', readFailed: '留言讀取失敗', refreshed: '留言已重新整理。', unavailable: '暫時無法讀取', count: '{count} 則留言', emptyTitle: '還沒有留言', emptyBody: '成為第一個分享想法的讀者。', guest: '訪客', previous: '上一頁', next: '下一頁', goPrevious: '前往上一頁', goNext: '前往下一頁', goPage: '前往第 {page} 頁', loadingTitle: '正在讀取留言', loadingBody: '從 BoyceLab 邊緣服務同步中…', errorTitle: '留言暫時無法顯示', retry: '再試一次', submitting: '送出中…', submit: '送出留言', noTime: '時間未記錄', timeout: '連線逾時，請稍後再試。', network: '目前無法連上留言服務，請檢查網路後重試。', service: '留言服務暫時無法使用。' },
    en: { required: 'Enter your display name and comment.', sending: 'Posting comment…', sendFailed: 'Unable to post comment', duplicate: 'This comment was already submitted and will not be duplicated.', success: 'Your comment is now public. Thank you!', readFailed: 'Unable to load comments', refreshed: 'Comments refreshed.', unavailable: 'Temporarily unavailable', count: '{count} comments', emptyTitle: 'No comments yet', emptyBody: 'Be the first reader to share a thought.', guest: 'Guest', previous: 'Previous', next: 'Next', goPrevious: 'Go to previous page', goNext: 'Go to next page', goPage: 'Go to page {page}', loadingTitle: 'Loading comments', loadingBody: 'Syncing from BoyceLab edge services…', errorTitle: 'Comments are temporarily unavailable', retry: 'Try again', submitting: 'Posting…', submit: 'Post comment', noTime: 'Time unavailable', timeout: 'Connection timed out. Please try again.', network: 'Unable to reach the comment service. Check your connection and retry.', service: 'The comment service is temporarily unavailable.' },
    ja: { required: '表示名とコメントを入力してください。', sending: 'コメントを投稿中…', sendFailed: 'コメントを投稿できません', duplicate: 'このコメントは送信済みのため重複表示されません。', success: 'コメントを公開しました。ありがとうございます！', readFailed: 'コメントを読み込めません', refreshed: 'コメントを更新しました。', unavailable: '一時的に利用できません', count: '{count}件のコメント', emptyTitle: 'まだコメントはありません', emptyBody: '最初のコメントを投稿してみましょう。', guest: 'ゲスト', previous: '前へ', next: '次へ', goPrevious: '前のページへ', goNext: '次のページへ', goPage: '{page}ページへ', loadingTitle: 'コメントを読み込み中', loadingBody: 'BoyceLabエッジサービスと同期しています…', errorTitle: 'コメントを一時的に表示できません', retry: '再試行', submitting: '投稿中…', submit: '投稿する', noTime: '時刻不明', timeout: '接続がタイムアウトしました。', network: 'コメントサービスに接続できません。ネットワークを確認してください。', service: 'コメントサービスは一時的に利用できません。' },
    ko: { required: '표시 이름과 댓글을 입력해 주세요.', sending: '댓글 등록 중…', sendFailed: '댓글 등록 실패', duplicate: '이미 등록된 댓글이며 중복 표시되지 않습니다.', success: '댓글이 공개되었습니다. 감사합니다!', readFailed: '댓글 불러오기 실패', refreshed: '댓글을 새로고침했습니다.', unavailable: '일시적으로 사용할 수 없음', count: '댓글 {count}개', emptyTitle: '아직 댓글이 없습니다', emptyBody: '첫 번째로 의견을 남겨 보세요.', guest: '방문자', previous: '이전', next: '다음', goPrevious: '이전 페이지로', goNext: '다음 페이지로', goPage: '{page}페이지로', loadingTitle: '댓글 불러오는 중', loadingBody: 'BoyceLab 엣지 서비스와 동기화 중…', errorTitle: '댓글을 일시적으로 표시할 수 없습니다', retry: '다시 시도', submitting: '등록 중…', submit: '댓글 등록', noTime: '시간 정보 없음', timeout: '연결 시간이 초과되었습니다.', network: '댓글 서비스에 연결할 수 없습니다. 네트워크를 확인해 주세요.', service: '댓글 서비스를 일시적으로 사용할 수 없습니다.' }
  };
  const articlePath = normalizeArticlePath(root.dataset.articlePath || window.location.pathname);
  const refs = {
    form: document.getElementById('articleCommentForm'),
    name: document.getElementById('articleCommentName'),
    message: document.getElementById('articleCommentMessage'),
    submit: document.getElementById('articleCommentSubmit'),
    status: document.getElementById('articleCommentStatus'),
    count: document.getElementById('articleCommentCount'),
    list: document.getElementById('articleCommentList'),
    refresh: document.getElementById('articleCommentRefresh'),
    pagination: document.getElementById('articleCommentPagination')
  };
  let pendingClientId = createClientId();
  let activePage = readPageFromUrl();
  let requestSequence = 0;

  restoreName();
  refs.form.addEventListener('submit', submitComment);
  refs.refresh.addEventListener('click', () => loadComments(activePage, { announce: true }));
  refs.pagination.addEventListener('click', handlePaginationClick);
  window.addEventListener('popstate', () => {
    activePage = readPageFromUrl();
    loadComments(activePage);
  });
  loadComments(activePage);

  async function submitComment(event) {
    event.preventDefault();
    if (!refs.form.reportValidity()) return;

    const displayName = refs.name.value.trim();
    const message = refs.message.value.trim();
    if (!displayName || !message) {
      setStatus(ui('required'), 'error');
      return;
    }

    setSubmitting(true);
    setStatus(ui('sending'));
    try {
      const response = await fetch(`${API_BASE_URL}/article-comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'omit',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: JSON.stringify({
          article_path: articlePath,
          display_name: displayName,
          message,
          client_id: pendingClientId,
          company: refs.form.elements.company.value
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `${ui('sendFailed')} (${response.status})`);

      storeName(displayName);
      refs.message.value = '';
      refs.form.elements.company.value = '';
      pendingClientId = createClientId();
      activePage = 1;
      updatePageUrl(1, true);
      await loadComments(1);
      setStatus(payload.duplicate ? ui('duplicate') : ui('success'), 'success');
    } catch (error) {
      setStatus(readableError(error), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function loadComments(page, options = {}) {
    const sequence = ++requestSequence;
    refs.list.setAttribute('aria-busy', 'true');
    refs.refresh.disabled = true;
    if (!refs.list.children.length) renderLoading();
    try {
      const query = new URLSearchParams({
        article: articlePath,
        page: String(page),
        per_page: String(PAGE_SIZE)
      });
      const response = await fetch(`${API_BASE_URL}/article-comments?${query}`, {
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'strict-origin-when-cross-origin'
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `${ui('readFailed')} (${response.status})`);
      if (sequence !== requestSequence) return;

      const comments = Array.isArray(payload.comments) ? payload.comments : [];
      const pagination = normalizePagination(payload.pagination, page, comments.length);
      activePage = pagination.page;
      if (activePage !== page) updatePageUrl(activePage, true);
      renderComments(comments, pagination);
      renderPagination(pagination);
      if (options.announce) setStatus(ui('refreshed'), 'success');
    } catch (error) {
      if (sequence !== requestSequence) return;
      renderError(readableError(error));
      refs.count.textContent = ui('unavailable');
      refs.pagination.hidden = true;
    } finally {
      if (sequence === requestSequence) {
        refs.list.setAttribute('aria-busy', 'false');
        refs.refresh.disabled = false;
      }
    }
  }

  function renderComments(comments, pagination) {
    refs.list.replaceChildren();
    refs.count.textContent = ui('count', { count: pagination.total });
    if (!comments.length) {
      const empty = document.createElement('div');
      empty.className = 'article-comment-empty';
      empty.innerHTML = `<strong>${ui('emptyTitle')}</strong><p>${ui('emptyBody')}</p>`;
      refs.list.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    comments.forEach((comment, index) => {
      const article = document.createElement('article');
      article.className = 'article-comment-item';

      const avatar = document.createElement('span');
      avatar.className = 'article-comment-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = firstCharacter(comment.display_name);

      const body = document.createElement('div');
      body.className = 'article-comment-body';
      const heading = document.createElement('div');
      heading.className = 'article-comment-meta';
      const name = document.createElement('strong');
      name.textContent = comment.display_name || ui('guest');
      const time = document.createElement('time');
      time.dateTime = comment.created_at || '';
      time.textContent = formatDate(comment.created_at);
      const order = document.createElement('span');
      order.textContent = `#${pagination.total - ((pagination.page - 1) * pagination.per_page) - index}`;
      heading.append(name, time, order);

      const message = document.createElement('p');
      message.textContent = comment.message || '';
      body.append(heading, message);
      article.append(avatar, body);
      fragment.appendChild(article);
    });
    refs.list.appendChild(fragment);
  }

  function renderPagination(pagination) {
    refs.pagination.replaceChildren();
    if (pagination.total_pages <= 1) {
      refs.pagination.hidden = true;
      return;
    }
    refs.pagination.hidden = false;
    refs.pagination.appendChild(pageButton(ui('previous'), pagination.page - 1, !pagination.has_previous, ui('goPrevious')));
    pageWindow(pagination.page, pagination.total_pages).forEach((value) => {
      if (value === '…') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'article-comment-page-ellipsis';
        ellipsis.textContent = value;
        refs.pagination.appendChild(ellipsis);
        return;
      }
      const button = pageButton(String(value), value, false, ui('goPage', { page: value }));
      if (value === pagination.page) button.setAttribute('aria-current', 'page');
      refs.pagination.appendChild(button);
    });
    refs.pagination.appendChild(pageButton(ui('next'), pagination.page + 1, !pagination.has_next, ui('goNext')));
  }

  function handlePaginationClick(event) {
    const button = event.target.closest('[data-comment-page]');
    if (!button || button.disabled) return;
    const page = Number(button.dataset.commentPage);
    if (!Number.isInteger(page) || page < 1 || page === activePage) return;
    activePage = page;
    updatePageUrl(page);
    loadComments(page).then(() => root.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function pageButton(label, page, disabled, ariaLabel) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.commentPage = String(page);
    button.disabled = disabled;
    button.setAttribute('aria-label', ariaLabel);
    return button;
  }

  function pageWindow(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
    if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '…', current - 1, current, current + 1, '…', total];
  }

  function renderLoading() {
    refs.list.innerHTML = `<div class="article-comment-empty"><strong>${ui('loadingTitle')}</strong><p>${ui('loadingBody')}</p></div>`;
  }

  function renderError(message) {
    refs.list.replaceChildren();
    const wrapper = document.createElement('div');
    wrapper.className = 'article-comment-empty error';
    const title = document.createElement('strong');
    title.textContent = ui('errorTitle');
    const description = document.createElement('p');
    description.textContent = message;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = ui('retry');
    retry.addEventListener('click', () => loadComments(activePage));
    wrapper.append(title, description, retry);
    refs.list.appendChild(wrapper);
  }

  function normalizePagination(value, requestedPage, itemCount) {
    const total = Math.max(0, Number(value?.total) || itemCount);
    const totalPages = Math.max(1, Number(value?.total_pages) || Math.ceil(total / PAGE_SIZE) || 1);
    const page = Math.min(totalPages, Math.max(1, Number(value?.page) || requestedPage));
    return {
      page,
      per_page: Math.max(1, Number(value?.per_page) || PAGE_SIZE),
      total,
      total_pages: totalPages,
      has_previous: Boolean(value?.has_previous ?? page > 1),
      has_next: Boolean(value?.has_next ?? page < totalPages)
    };
  }

  function setSubmitting(submitting) {
    refs.submit.disabled = submitting;
    refs.name.disabled = submitting;
    refs.message.disabled = submitting;
    refs.submit.textContent = submitting ? ui('submitting') : ui('submit');
  }

  function setStatus(message, type = '') {
    refs.status.textContent = message;
    refs.status.className = `article-comment-status${type ? ` ${type}` : ''}`;
  }

  function updatePageUrl(page, replace = false) {
    const url = new URL(window.location.href);
    if (page <= 1) url.searchParams.delete(PAGE_QUERY_KEY);
    else url.searchParams.set(PAGE_QUERY_KEY, String(page));
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  }

  function readPageFromUrl() {
    const value = Number(new URL(window.location.href).searchParams.get(PAGE_QUERY_KEY) || 1);
    return Number.isInteger(value) && value > 0 ? value : 1;
  }

  function restoreName() {
    try { refs.name.value = localStorage.getItem(NAME_STORAGE_KEY) || ''; } catch (_) {}
  }

  function storeName(value) {
    try { localStorage.setItem(NAME_STORAGE_KEY, value); } catch (_) {}
  }

  function normalizeArticlePath(value) {
    const url = new URL(value, window.location.origin);
    return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  }

  function createClientId() {
    const random = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `comment-${random}`;
  }

  function firstCharacter(value) {
    return Array.from(String(value || ui('guest')).trim())[0]?.toUpperCase() || ui('guest')[0];
  }

  function formatDate(value) {
    if (!value) return ui('noTime');
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  function readableError(error) {
    if (error.name === 'AbortError') return ui('timeout');
    if (error instanceof TypeError) return ui('network');
    return error.message || ui('service');
  }

  function ui(key, values = {}) {
    const template = messages[locale]?.[key] || messages['zh-TW'][key] || key;
    return Object.entries(values).reduce((result, [name, value]) => result.replace(`{${name}}`, String(value)), template);
  }
})();
