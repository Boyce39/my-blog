(function () {
  'use strict';

  const API_BASE_URL = window.BoyceBackend?.baseUrl || 'https://webpython-h2y7.onrender.com';
  let retryScheduled = false;

  function createFriendCard(friend) {
    const card = document.createElement('a');
    card.className = 'friend-card';
    card.href = friend.site_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const domain = document.createElement('span');
    domain.className = 'friend-domain';
    try {
      domain.textContent = new URL(friend.site_url).hostname;
    } catch (error) {
      domain.textContent = friend.site_url;
    }

    const name = document.createElement('strong');
    name.className = 'friend-name';
    name.textContent = friend.site_name;

    const description = document.createElement('p');
    description.className = 'friend-description';
    description.textContent = friend.description || '點擊前往這個網站。';

    card.append(domain, name, description);
    return card;
  }

  function renderEmpty(container, message) {
    container.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'friend-empty';
    empty.textContent = message;
    container.appendChild(empty);
  }

  async function loadFriends() {
    const containers = Array.from(document.querySelectorAll('[data-friends-list]'));
    if (!containers.length) return;

    try {
      const response = await fetch(`${API_BASE_URL}/friend-sites`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'omit'
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

      const friends = Array.isArray(result.friend_sites) ? result.friend_sites : [];
      containers.forEach(container => {
        const limit = Number(container.dataset.limit || 0);
        const visibleFriends = limit > 0 ? friends.slice(0, limit) : friends;
        container.replaceChildren();

        if (!visibleFriends.length) {
          renderEmpty(container, '第一批友站正在募集，歡迎成為這裡的第一位鄰居。');
          return;
        }

        visibleFriends.forEach(friend => container.appendChild(createFriendCard(friend)));
      });
    } catch (error) {
      containers.forEach(container => {
        renderEmpty(container, '後端正在喚醒，友站名單稍後會自動重新載入。');
      });

      if (!retryScheduled) {
        retryScheduled = true;
        window.addEventListener('boycelab:backend', event => {
          if (event.detail?.state !== 'ready') return;
          retryScheduled = false;
          loadFriends();
        }, { once: true });
      }
    }
  }

  function setupApplicationForm() {
    const toggle = document.getElementById('friendApplyToggle');
    const panel = document.getElementById('friendApplyPanel');
    const form = document.getElementById('friendApplicationForm');
    const status = document.getElementById('friendFormStatus');
    if (!toggle || !panel || !form || !status) return;

    function setPanel(open) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        form.elements.site_name.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener('click', () => setPanel(panel.hidden));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);
      const payload = {
        site_name: String(formData.get('site_name') || '').trim(),
        site_url: String(formData.get('site_url') || '').trim(),
        description: String(formData.get('description') || '').trim(),
        contact: String(formData.get('contact') || '').trim(),
        company: String(formData.get('company') || ''),
        client_id: window.crypto?.randomUUID?.() || `friend-${Date.now()}-${Math.random().toString(16).slice(2)}`
      };

      submitButton.disabled = true;
      status.className = 'form-status';
      status.textContent = '正在送出申請；若 Render 休眠，可能需要約一分鐘喚醒。';

      try {
        const response = await fetch(`${API_BASE_URL}/friend-applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          credentials: 'omit',
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);

        form.reset();
        status.className = 'form-status success';
        status.textContent = '申請已收到！審核通過後會出現在友站列表。';
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = `目前無法送出：${error.message}。內容仍保留在表單中，請稍後再試。`;
      } finally {
        submitButton.disabled = false;
      }
    });

    if (window.location.hash === '#apply') setPanel(true);
  }

  function init() {
    loadFriends();
    setupApplicationForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
