(function () {
  'use strict';

  const API_BASE_URL = window.BoyceApiConfig?.baseUrl || window.BoyceBackend?.baseUrl || 'https://api.boycelab.com';
  const PAGE_SIZE = 8;
  let requestSequence = 0;

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  function createText(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function currentPage() {
    const requested = Number(new URL(window.location.href).searchParams.get('page') || 1);
    return Number.isInteger(requested) && requested > 0 ? requested : 1;
  }

  function setPageUrl(page, mode) {
    const url = new URL(window.location.href);
    if (page > 1) url.searchParams.set('page', String(page));
    else url.searchParams.delete('page');
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({ page }, '', url);
  }

  function createReplyCard(item, position) {
    const card = document.createElement('article');
    card.className = 'anonymous-reply-card';

    const head = document.createElement('header');
    head.className = 'reply-card-head';
    head.append(
      createText('span', 'reply-signal', `QUESTION ${String(position).padStart(2, '0')}`),
      createText('time', 'reply-date', formatDate(item.replied_at || item.created_at))
    );

    const question = document.createElement('section');
    question.className = 'reply-question';
    question.append(
      createText('span', 'reply-role', '匿名提問'),
      createText('p', 'reply-question-copy', item.message || '')
    );

    const answer = document.createElement('section');
    answer.className = 'reply-answer';
    const avatar = createText('span', 'reply-avatar', 'B');
    avatar.setAttribute('aria-hidden', 'true');
    const answerBody = document.createElement('div');
    answerBody.append(
      createText('span', 'reply-role', 'BoyceLab 回覆'),
      createText('p', 'reply-answer-copy', item.reply_text || '')
    );
    answer.append(avatar, answerBody);

    card.append(head, question, answer);
    return card;
  }

  function renderEmpty(container, title, detail) {
    container.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'reply-wall-empty';
    const link = document.createElement('a');
    link.className = 'lab-button secondary';
    link.href = '/anonymous/';
    link.textContent = '送出第一個問題';
    empty.append(createText('strong', '', title), createText('span', '', detail), link);
    container.appendChild(empty);
  }

  function renderError(container) {
    container.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'reply-wall-empty';
    const retry = document.createElement('button');
    retry.className = 'lab-button secondary';
    retry.type = 'button';
    retry.textContent = '重新載入';
    retry.addEventListener('click', function () {
      loadReplies(currentPage(), { historyMode: 'replace' });
    });
    empty.append(
      createText('strong', '', '目前無法載入公開回覆'),
      createText('span', '', '請檢查網路後重新載入。'),
      retry
    );
    container.appendChild(empty);
  }

  function pageRange(page, totalPages) {
    const pages = new Set([1, totalPages]);
    for (let value = page - 1; value <= page + 1; value += 1) {
      if (value > 1 && value < totalPages) pages.add(value);
    }
    return Array.from(pages).sort((left, right) => left - right);
  }

  function paginationButton(label, page, options = {}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = options.number ? 'reply-page-number' : 'reply-page-direction';
    button.textContent = label;
    button.dataset.page = String(page);
    button.disabled = Boolean(options.disabled);
    if (options.current) button.setAttribute('aria-current', 'page');
    if (options.label) button.setAttribute('aria-label', options.label);
    return button;
  }

  function renderPagination(pagination) {
    const navigation = document.getElementById('anonymousReplyPagination');
    if (!navigation) return;
    navigation.replaceChildren();
    navigation.hidden = pagination.total_pages <= 1;
    if (navigation.hidden) return;

    navigation.appendChild(paginationButton('上一頁', pagination.page - 1, {
      disabled: !pagination.has_previous,
      label: '前往上一頁'
    }));

    const numbers = document.createElement('span');
    numbers.className = 'reply-page-numbers';
    const pages = pageRange(pagination.page, pagination.total_pages);
    pages.forEach(function (page, index) {
      if (index > 0 && page - pages[index - 1] > 1) {
        numbers.appendChild(createText('span', 'reply-page-ellipsis', '…'));
      }
      numbers.appendChild(paginationButton(String(page), page, {
        number: true,
        current: page === pagination.page,
        label: `前往第 ${page} 頁`
      }));
    });
    navigation.appendChild(numbers);
    navigation.appendChild(paginationButton('下一頁', pagination.page + 1, {
      disabled: !pagination.has_next,
      label: '前往下一頁'
    }));
  }

  async function loadReplies(page, options = {}) {
    const container = document.getElementById('anonymousReplyList');
    const counter = document.getElementById('anonymousReplyCount');
    if (!container || !counter) return;

    const sequence = ++requestSequence;
    container.setAttribute('aria-busy', 'true');
    container.classList.add('is-loading');
    counter.textContent = 'SYNCING';

    try {
      const response = await fetch(`${API_BASE_URL}/anonymous-replies?page=${page}&per_page=${PAGE_SIZE}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'omit'
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
      if (sequence !== requestSequence) return;

      const replies = Array.isArray(payload.replies) ? payload.replies : [];
      const pagination = payload.pagination || {
        page: 1,
        per_page: PAGE_SIZE,
        total: replies.length,
        total_pages: 1,
        has_previous: false,
        has_next: false
      };
      counter.textContent = `${pagination.total} REPLIES`;
      container.replaceChildren();

      if (!replies.length) {
        renderEmpty(container, '第一則公開回覆正在準備中', '歡迎先送出匿名問題。');
      } else {
        const offset = (pagination.page - 1) * pagination.per_page;
        replies.forEach(function (item, index) {
          container.appendChild(createReplyCard(item, offset + index + 1));
        });
      }

      renderPagination(pagination);
      setPageUrl(pagination.page, options.historyMode || 'replace');
      if (options.focusList) {
        const panel = document.querySelector('.reply-wall-panel');
        panel?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
    } catch (error) {
      if (sequence !== requestSequence) return;
      counter.textContent = 'OFFLINE';
      renderError(container);
      const navigation = document.getElementById('anonymousReplyPagination');
      if (navigation) navigation.hidden = true;
    } finally {
      if (sequence === requestSequence) {
        container.removeAttribute('aria-busy');
        container.classList.remove('is-loading');
      }
    }
  }

  function initialize() {
    const navigation = document.getElementById('anonymousReplyPagination');
    navigation?.addEventListener('click', function (event) {
      const button = event.target.closest('button[data-page]');
      if (!button || button.disabled) return;
      const page = Number(button.dataset.page);
      if (!Number.isInteger(page) || page < 1 || page === currentPage()) return;
      loadReplies(page, { historyMode: 'push', focusList: true });
    });
    window.addEventListener('popstate', function () {
      loadReplies(currentPage(), { historyMode: 'replace' });
    });
    loadReplies(currentPage(), { historyMode: 'replace' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
