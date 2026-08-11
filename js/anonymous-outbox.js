(function () {
  'use strict';

  const API_BASE_URL = window.BoyceBackend?.baseUrl || 'https://webpython-h2y7.onrender.com';
  const STORAGE_KEY = 'boycelab_anonymous_outbox_v1';
  const MAX_QUEUE_SIZE = 10;
  let memoryQueue = [];
  let flushing = false;
  let retryTimer = null;

  function createId() {
    return window.crypto?.randomUUID?.() || `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function readQueue() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return memoryQueue;
    }
  }

  function writeQueue(queue) {
    memoryQueue = queue;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      // Fall back to memory when local storage is unavailable.
    }
  }

  function setFeedback(message, type) {
    const feedback = document.getElementById('anonymousFeedback');
    if (!feedback) return;
    feedback.className = `form-status${type ? ` ${type}` : ''}`;
    feedback.textContent = message;
  }

  function renderQueueCount() {
    const element = document.getElementById('anonymousQueueCount');
    if (!element) return;
    const count = readQueue().length;
    element.textContent = count ? `${count} 則訊息等待後端確認` : '沒有等待傳送的訊息';
  }

  function setConnection(state) {
    const panel = document.getElementById('anonymousConnection');
    const text = document.getElementById('anonymousConnectionText');
    if (!panel || !text) return;

    panel.className = 'anonymous-status';
    if (state === 'ready') {
      panel.classList.add('ready');
      text.textContent = '後端已就緒，背景佇列會立即送出。';
    } else if (state === 'offline') {
      panel.classList.add('offline');
      text.textContent = '目前離線；訊息會保留在這台裝置，恢復網路後重試。';
    } else {
      text.textContent = '正在喚醒留言後端；現在仍可直接輸入並送出。';
    }
  }

  function scheduleRetry(attempts) {
    window.clearTimeout(retryTimer);
    const delay = Math.min(5000 * Math.max(attempts, 1), 30000);
    retryTimer = window.setTimeout(flushQueue, delay);
  }

  async function flushQueue() {
    if (flushing || !navigator.onLine) {
      if (!navigator.onLine) setConnection('offline');
      return;
    }

    const queue = readQueue();
    if (!queue.length) {
      renderQueueCount();
      return;
    }

    flushing = true;
    const item = queue[0];
    setFeedback('訊息正在背景傳送；Render 冷啟動時可能需要約一分鐘。');

    try {
      const response = await fetch(`${API_BASE_URL}/anonymous-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        credentials: 'omit',
        keepalive: true,
        body: JSON.stringify({
          message: item.message,
          client_id: item.id,
          company: ''
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

      const latestQueue = readQueue().filter(queuedItem => queuedItem.id !== item.id);
      writeQueue(latestQueue);
      renderQueueCount();
      setConnection('ready');
      setFeedback('訊息已由後端確認收到。', 'success');
      window.setTimeout(flushQueue, 0);
    } catch (error) {
      const latestQueue = readQueue();
      const queuedItem = latestQueue.find(queued => queued.id === item.id);
      if (queuedItem) queuedItem.attempts = Number(queuedItem.attempts || 0) + 1;
      writeQueue(latestQueue);
      renderQueueCount();
      setFeedback('後端尚未確認，訊息仍安全保留在這台裝置並會自動重試。');
      scheduleRetry(queuedItem?.attempts || 1);
    } finally {
      flushing = false;
    }
  }

  function setupForm() {
    const form = document.getElementById('anonymousForm');
    const messageInput = document.getElementById('anonymousMessage');
    const counter = document.getElementById('anonymousCounter');
    if (!form || !messageInput || !counter) return;

    function updateCounter() {
      counter.textContent = `${messageInput.value.length} / 1000`;
    }

    messageInput.addEventListener('input', updateCounter);
    updateCounter();

    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(form);
      const message = String(formData.get('message') || '').trim();
      const honeypot = String(formData.get('company') || '');

      if (honeypot) {
        form.reset();
        return;
      }

      if (!message) {
        setFeedback('請先輸入訊息內容。', 'error');
        return;
      }

      const queue = readQueue();
      if (queue.length >= MAX_QUEUE_SIZE) {
        setFeedback('這台裝置已有太多訊息等待送出，請稍後再試。', 'error');
        return;
      }

      queue.push({
        id: createId(),
        message: message,
        createdAt: new Date().toISOString(),
        attempts: 0
      });
      writeQueue(queue);
      form.reset();
      updateCounter();
      renderQueueCount();
      setFeedback('已加入背景傳送佇列，你可以繼續瀏覽；確認送達前請勿清除瀏覽器資料。');

      window.BoyceBackend?.wake?.({ force: true });
      flushQueue();
    });
  }

  function init() {
    setupForm();
    renderQueueCount();
    setConnection(navigator.onLine ? 'waking' : 'offline');
    flushQueue();

    window.addEventListener('boycelab:backend', event => {
      if (event.detail?.state === 'ready') {
        setConnection('ready');
        flushQueue();
      } else if (event.detail?.state === 'unavailable') {
        setConnection(navigator.onLine ? 'waking' : 'offline');
      }
    });
    window.addEventListener('online', () => {
      setConnection('waking');
      window.BoyceBackend?.wake?.({ force: true });
      flushQueue();
    });
    window.addEventListener('offline', () => setConnection('offline'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
