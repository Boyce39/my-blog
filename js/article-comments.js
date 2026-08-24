(() => {
  'use strict';

  const root = document.getElementById('article-comments');
  if (!root) return;

  const API_BASE_URL = window.BoyceApiConfig?.baseUrl || 'https://api.boycelab.com';
  const PAGE_SIZE = 10;
  const NAME_STORAGE_KEY = 'boycelab_article_comment_name';
  const PAGE_QUERY_KEY = 'comment_page';
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
      setStatus('請填寫顯示名稱與留言內容。', 'error');
      return;
    }

    setSubmitting(true);
    setStatus('正在送出留言…');
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
      if (!response.ok) throw new Error(payload.error || `留言送出失敗（${response.status}）`);

      storeName(displayName);
      refs.message.value = '';
      refs.form.elements.company.value = '';
      pendingClientId = createClientId();
      activePage = 1;
      updatePageUrl(1, true);
      await loadComments(1);
      setStatus(payload.duplicate ? '這則留言已經送出，不會重複顯示。' : '留言已公開，謝謝你的回應！', 'success');
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
      if (!response.ok) throw new Error(payload.error || `留言讀取失敗（${response.status}）`);
      if (sequence !== requestSequence) return;

      const comments = Array.isArray(payload.comments) ? payload.comments : [];
      const pagination = normalizePagination(payload.pagination, page, comments.length);
      activePage = pagination.page;
      if (activePage !== page) updatePageUrl(activePage, true);
      renderComments(comments, pagination);
      renderPagination(pagination);
      if (options.announce) setStatus('留言已重新整理。', 'success');
    } catch (error) {
      if (sequence !== requestSequence) return;
      renderError(readableError(error));
      refs.count.textContent = '暫時無法讀取';
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
    refs.count.textContent = `${pagination.total} 則留言`;
    if (!comments.length) {
      const empty = document.createElement('div');
      empty.className = 'article-comment-empty';
      empty.innerHTML = '<strong>還沒有留言</strong><p>成為第一個分享想法的讀者。</p>';
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
      name.textContent = comment.display_name || '訪客';
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
    refs.pagination.appendChild(pageButton('上一頁', pagination.page - 1, !pagination.has_previous, '前往上一頁'));
    pageWindow(pagination.page, pagination.total_pages).forEach((value) => {
      if (value === '…') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'article-comment-page-ellipsis';
        ellipsis.textContent = value;
        refs.pagination.appendChild(ellipsis);
        return;
      }
      const button = pageButton(String(value), value, false, `前往第 ${value} 頁`);
      if (value === pagination.page) button.setAttribute('aria-current', 'page');
      refs.pagination.appendChild(button);
    });
    refs.pagination.appendChild(pageButton('下一頁', pagination.page + 1, !pagination.has_next, '前往下一頁'));
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
    refs.list.innerHTML = '<div class="article-comment-empty"><strong>正在讀取留言</strong><p>從 BoyceLab 邊緣服務同步中…</p></div>';
  }

  function renderError(message) {
    refs.list.replaceChildren();
    const wrapper = document.createElement('div');
    wrapper.className = 'article-comment-empty error';
    const title = document.createElement('strong');
    title.textContent = '留言暫時無法顯示';
    const description = document.createElement('p');
    description.textContent = message;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = '再試一次';
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
    refs.submit.textContent = submitting ? '送出中…' : '送出留言';
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
    return Array.from(String(value || '訪').trim())[0]?.toUpperCase() || '訪';
  }

  function formatDate(value) {
    if (!value) return '時間未記錄';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  function readableError(error) {
    if (error.name === 'AbortError') return '連線逾時，請稍後再試。';
    if (error instanceof TypeError) return '目前無法連上留言服務，請檢查網路後重試。';
    return error.message || '留言服務暫時無法使用。';
  }
})();
