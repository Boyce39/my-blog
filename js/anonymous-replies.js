(function () {
  'use strict';

  const API_BASE_URL = (window.BoyceApiConfig?.baseUrl || window.BoyceBackend?.baseUrl || 'https://api.boycelab.com').replace(/\/$/, '');
  const PAGE_SIZE = 8;
  const expanded = new Set();
  let requestSequence = 0;
  let controller = null;
  let replies = [];
  let pagination = null;
  let loading = false;

  function locale() {
    return window.BoyceI18n?.locale || 'zh-TW';
  }

  function translate(text, values = {}) {
    const template = window.BoyceI18n?.t?.(text, values) || text;
    return template.replace(/\{([^{}]+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match);
  }

  function setLabel(element, text, values = {}) {
    element.dataset.replyLabel = text;
    element.dataset.replyValues = JSON.stringify(values);
    element.setAttribute('data-i18n-skip', '');
    element.textContent = translate(text, values);
    return element;
  }

  function createLabel(tag, className, text, values = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return setLabel(element, text, values);
  }

  function createOriginal(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.setAttribute('data-i18n-skip', '');
    element.setAttribute('translate', 'no');
    element.textContent = text;
    return element;
  }

  function parseDate(value) {
    if (typeof value !== 'string' || !value) return null;
    const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(' ', 'T')}Z` : value;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function formatDate(value) {
    const date = parseDate(value);
    return date ? new Intl.DateTimeFormat(locale(), {
      year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Taipei'
    }).format(date) : '';
  }

  function currentPage() {
    const requested = Number(new URL(window.location.href).searchParams.get('page') || 1);
    return Number.isSafeInteger(requested) && requested > 0 && requested <= 100000 ? requested : 1;
  }

  function setPageUrl(page, mode) {
    const url = new URL(window.location.href);
    if (page > 1) url.searchParams.set('page', String(page));
    else url.searchParams.delete('page');
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({ ...window.history.state, page }, '', url);
  }

  function isLongText(text) {
    return Array.from(text).length > 280 || text.split(/\r?\n/).length > 4;
  }

  function createContent(text, kind, key) {
    const copy = createOriginal('p', `reply-${kind}-copy`, text);
    if (!isLongText(text)) return copy;
    const details = document.createElement('details');
    details.className = `reply-details reply-${kind}-details`;
    details.open = expanded.has(key);
    const summary = document.createElement('summary');
    summary.className = 'reply-details-summary';
    const compactText = text.replace(/\s+/g, ' ').trim();
    const characters = Array.from(compactText);
    const preview = createOriginal('span', 'reply-preview', `${characters.slice(0, 160).join('')}${characters.length > 160 ? '…' : ''}`);
    const expandLabel = createLabel('span', 'reply-expand-label', kind === 'answer' ? '展開完整回覆' : '展開完整問題');
    const collapseLabel = createLabel('span', 'reply-collapse-label', kind === 'answer' ? '收合回覆' : '收合問題');
    const update = () => {
      preview.hidden = details.open;
      expandLabel.hidden = details.open;
      collapseLabel.hidden = !details.open;
      if (details.open) expanded.add(key);
      else expanded.delete(key);
    };
    summary.append(preview, document.createTextNode(' '), expandLabel, collapseLabel);
    details.append(summary, copy);
    details.addEventListener('toggle', () => {
      if (details.isConnected) update();
    });
    update();
    return details;
  }

  function createReplyCard(item, position) {
    const card = document.createElement('article');
    card.className = 'anonymous-reply-card anonymous-reply-card--compact';
    const head = document.createElement('header');
    head.className = 'reply-card-head';
    const date = parseDate(item.repliedAt || item.createdAt);
    const time = document.createElement('time');
    time.className = 'reply-date';
    time.setAttribute('data-i18n-skip', '');
    if (date) {
      time.dateTime = date.toISOString();
      time.textContent = formatDate(time.dateTime);
    }
    head.append(createLabel('span', 'reply-signal', '提問 {number}', { number: String(position).padStart(2, '0') }), time);
    const question = document.createElement('section');
    question.className = 'reply-question';
    question.append(createLabel('span', 'reply-role', '匿名提問'), createContent(item.message, 'question', `${position}-question`));
    const answer = document.createElement('section');
    answer.className = 'reply-answer';
    const avatar = document.createElement('span');
    avatar.className = 'reply-avatar';
    avatar.textContent = 'B';
    avatar.setAttribute('aria-hidden', 'true');
    const answerBody = document.createElement('div');
    answerBody.className = 'reply-answer-body';
    answerBody.append(createLabel('span', 'reply-role', 'BoyceLab 回覆'), createContent(item.replyText, 'answer', `${position}-answer`));
    answer.append(avatar, answerBody);
    card.append(head, question, answer);
    return card;
  }

  function clearFilters() {
    const search = document.getElementById('anonymousReplySearch');
    const filter = document.getElementById('anonymousReplyFilter');
    if (search) search.value = '';
    if (filter) filter.value = 'all';
    renderReplies();
    search?.focus();
  }

  function renderEmpty(container, filtered) {
    const empty = document.createElement('div');
    empty.className = 'reply-wall-empty';
    const action = document.createElement(filtered ? 'button' : 'a');
    action.className = 'lab-button secondary';
    if (filtered) {
      action.type = 'button';
      setLabel(action, '清除篩選');
      action.addEventListener('click', clearFilters);
    } else {
      action.href = '/anonymous/';
      setLabel(action, '送出第一個問題');
    }
    empty.append(
      createLabel('strong', '', filtered ? '沒有符合的問答' : '第一則公開回覆正在準備中'),
      createLabel('span', '', filtered ? '請換個關鍵字、清除篩選，或前往其他分頁。' : '歡迎先送出匿名問題。'), action
    );
    container.appendChild(empty);
  }

  function renderError(container) {
    const empty = document.createElement('div');
    empty.className = 'reply-wall-empty';
    const retry = createLabel('button', 'lab-button secondary', '重新載入');
    retry.type = 'button';
    retry.addEventListener('click', () => loadReplies(currentPage(), { historyMode: 'replace' }));
    empty.append(createLabel('strong', '', '目前無法載入公開回覆'), createLabel('span', '', '請檢查網路後重新載入。'), retry);
    container.replaceChildren(empty);
  }

  function pageRange(page, totalPages) {
    const pages = new Set([1, totalPages]);
    for (let value = page - 1; value <= page + 1; value += 1) {
      if (value > 1 && value < totalPages) pages.add(value);
    }
    return Array.from(pages).sort((left, right) => left - right);
  }

  function paginationButton(text, page, options = {}) {
    const button = createLabel('button', options.number ? 'reply-page-number' : 'reply-page-direction', text);
    button.type = 'button';
    button.dataset.page = String(page);
    button.disabled = Boolean(options.disabled);
    if (options.current) button.setAttribute('aria-current', 'page');
    button.dataset.replyAriaLabel = options.label || '前往第 {page} 頁';
    button.setAttribute('aria-label', translate(button.dataset.replyAriaLabel, { page }));
    return button;
  }

  function renderPagination() {
    const navigation = document.getElementById('anonymousReplyPagination');
    if (!navigation || !pagination) return;
    navigation.replaceChildren();
    navigation.hidden = pagination.totalPages <= 1;
    if (navigation.hidden) return;
    navigation.appendChild(paginationButton('上一頁', pagination.page - 1, { disabled: pagination.page <= 1, label: '前往上一頁' }));
    const numbers = document.createElement('span');
    numbers.className = 'reply-page-numbers';
    const pages = pageRange(pagination.page, pagination.totalPages);
    pages.forEach((page, index) => {
      if (index > 0 && page - pages[index - 1] > 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'reply-page-ellipsis';
        ellipsis.textContent = '…';
        ellipsis.setAttribute('aria-hidden', 'true');
        numbers.appendChild(ellipsis);
      }
      numbers.appendChild(paginationButton(String(page), page, { number: true, current: page === pagination.page }));
    });
    navigation.append(numbers, paginationButton('下一頁', pagination.page + 1, { disabled: pagination.page >= pagination.totalPages, label: '前往下一頁' }));
  }

  function normalizePagination(value, requestedPage, count) {
    const integer = (input, fallback) => Number.isSafeInteger(Number(input)) && Number(input) >= 0 ? Number(input) : fallback;
    const total = Math.max(count, integer(value?.total, count));
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(totalPages, Math.max(1, integer(value?.page, requestedPage)));
    return { page, total, totalPages };
  }

  function renderReplies() {
    if (!pagination || loading) return;
    const container = document.getElementById('anonymousReplyList');
    const counter = document.getElementById('anonymousReplyCount');
    const query = (document.getElementById('anonymousReplySearch')?.value || '').trim().normalize('NFKC').toLocaleLowerCase(locale());
    const longOnly = document.getElementById('anonymousReplyFilter')?.value === 'long';
    const matches = replies.map((item, index) => ({ item, index })).filter(({ item }) => {
      const searchable = `${item.message}\n${item.replyText}`.normalize('NFKC').toLocaleLowerCase(locale());
      return searchable.includes(query) && (!longOnly || isLongText(item.replyText));
    });
    container.replaceChildren();
    if (!matches.length) renderEmpty(container, replies.length > 0);
    else {
      const offset = (pagination.page - 1) * PAGE_SIZE;
      matches.forEach(({ item, index }) => container.appendChild(createReplyCard(item, offset + index + 1)));
    }
    setLabel(counter, '本頁顯示 {visible} / {loaded} 則；共 {total} 則回覆', {
      visible: matches.length, loaded: replies.length, total: pagination.total
    });
  }

  function refreshLabels() {
    const root = document.querySelector('.anonymous-replies-page');
    if (!root) return;
    root.querySelectorAll('[data-reply-label]').forEach(element => {
      element.textContent = translate(element.dataset.replyLabel, JSON.parse(element.dataset.replyValues || '{}'));
    });
    root.querySelectorAll('[data-reply-aria-label]').forEach(element => {
      element.setAttribute('aria-label', translate(element.dataset.replyAriaLabel, { page: element.dataset.page }));
    });
    root.querySelectorAll('.reply-date[datetime]').forEach(element => { element.textContent = formatDate(element.dateTime); });
  }

  async function loadReplies(page, options = {}) {
    const container = document.getElementById('anonymousReplyList');
    const counter = document.getElementById('anonymousReplyCount');
    if (!container || !counter) return;
    controller?.abort();
    const activeController = new AbortController();
    controller = activeController;
    const sequence = ++requestSequence;
    const timer = window.setTimeout(() => activeController.abort(), 15000);
    loading = true;
    container.setAttribute('aria-busy', 'true');
    container.classList.add('is-loading');
    setLabel(counter, '載入中…');
    document.querySelectorAll('#anonymousReplyPagination button').forEach(button => { button.disabled = true; });
    try {
      const response = await fetch(`${API_BASE_URL}/anonymous-replies?page=${page}&per_page=${PAGE_SIZE}`, {
        signal: activeController.signal, headers: { Accept: 'application/json' }, cache: 'no-store', credentials: 'omit'
      });
      const payload = await response.json();
      if (sequence !== requestSequence) return;
      if (!response.ok || !Array.isArray(payload?.replies)) throw new Error('Invalid public replies response');
      replies = payload.replies.filter(item => item && typeof item.message === 'string' && typeof item.reply_text === 'string' && item.reply_text.trim()).slice(0, PAGE_SIZE).map(item => ({
        message: item.message, replyText: item.reply_text,
        createdAt: typeof item.created_at === 'string' ? item.created_at : '',
        repliedAt: typeof item.replied_at === 'string' ? item.replied_at : ''
      }));
      pagination = normalizePagination(payload.pagination, page, replies.length);
      expanded.clear();
      loading = false;
      renderReplies();
      renderPagination();
      setPageUrl(pagination.page, options.historyMode || 'replace');
      if (options.focusList) {
        const panel = document.querySelector('.reply-wall-panel');
        panel?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        document.getElementById('reply-list-title')?.focus({ preventScroll: true });
      }
    } catch (error) {
      if (sequence !== requestSequence) return;
      pagination = null;
      replies = [];
      setLabel(counter, '暫時無法載入');
      renderError(container);
      const navigation = document.getElementById('anonymousReplyPagination');
      if (navigation) navigation.hidden = true;
    } finally {
      window.clearTimeout(timer);
      if (sequence === requestSequence) {
        loading = false;
        controller = null;
        container.removeAttribute('aria-busy');
        container.classList.remove('is-loading');
      }
    }
  }

  function initialize() {
    if (!document.getElementById('anonymousReplyList')) return;
    const navigation = document.getElementById('anonymousReplyPagination');
    navigation?.addEventListener('click', event => {
      const button = event.target.closest('button[data-page]');
      if (!button || button.disabled || loading) return;
      const page = Number(button.dataset.page);
      if (!Number.isSafeInteger(page) || page < 1 || page === pagination?.page) return;
      loadReplies(page, { historyMode: 'push', focusList: true });
    });
    document.getElementById('anonymousReplySearch')?.addEventListener('input', renderReplies);
    document.getElementById('anonymousReplyFilter')?.addEventListener('change', renderReplies);
    document.getElementById('anonymousReplyClear')?.addEventListener('click', clearFilters);
    window.addEventListener('boycelab:languagechange', refreshLabels);
    window.addEventListener('popstate', () => {
      if (currentPage() !== pagination?.page) loadReplies(currentPage(), { historyMode: 'replace' });
    });
    loadReplies(currentPage(), { historyMode: 'replace' });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
