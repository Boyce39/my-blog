(function () {
  'use strict';

  const API_BASE_URL = window.BoyceApiConfig?.baseUrl || window.BoyceBackend?.baseUrl || 'https://api.boycelab.com';

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
    element.className = className;
    element.textContent = text;
    return element;
  }

  function createReplyCard(item, index) {
    const card = document.createElement('article');
    card.className = 'anonymous-reply-card';

    const head = document.createElement('header');
    head.className = 'reply-card-head';
    head.append(
      createText('span', 'reply-signal', `SIGNAL ${String(index + 1).padStart(2, '0')}`),
      createText('time', 'reply-date', formatDate(item.replied_at || item.created_at))
    );

    const question = document.createElement('section');
    question.className = 'reply-question';
    question.append(
      createText('span', 'reply-role', 'ANONYMOUS / QUESTION'),
      createText('p', 'reply-question-copy', item.message || '')
    );

    const bridge = document.createElement('div');
    bridge.className = 'reply-bridge';
    bridge.innerHTML = '<i></i><span>RESPONSE LINKED</span><i></i>';

    const answer = document.createElement('section');
    answer.className = 'reply-answer';
    const avatar = createText('span', 'reply-avatar', 'B');
    const answerBody = document.createElement('div');
    answerBody.append(
      createText('span', 'reply-role', 'BOYCELAB / RESPONSE'),
      createText('p', 'reply-answer-copy', item.reply_text || '')
    );
    answer.append(avatar, answerBody);

    card.append(head, question, bridge, answer);
    return card;
  }

  function renderEmpty(container, title, detail) {
    container.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'reply-wall-empty';
    empty.append(
      createText('strong', '', title),
      createText('span', '', detail)
    );
    container.appendChild(empty);
  }

  async function loadReplies() {
    const container = document.getElementById('anonymousReplyList');
    const counter = document.getElementById('anonymousReplyCount');
    if (!container || !counter) return;

    try {
      const response = await fetch(`${API_BASE_URL}/anonymous-replies?limit=100`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'omit'
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
      const replies = Array.isArray(payload.replies) ? payload.replies : [];
      counter.textContent = `${replies.length} REPLIES`;
      container.replaceChildren();
      if (!replies.length) {
        renderEmpty(container, '第一則公開回覆正在準備中', '你仍然可以先送出匿名訊息。');
        return;
      }
      replies.forEach((item, index) => container.appendChild(createReplyCard(item, index)));
    } catch (error) {
      counter.textContent = 'OFFLINE';
      renderEmpty(container, '目前無法載入公開回覆', '請稍後重新整理頁面。');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReplies, { once: true });
  } else {
    loadReplies();
  }
})();
