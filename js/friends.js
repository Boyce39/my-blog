(function () {
  'use strict';

  const API_BASE_URL = window.BoyceApiConfig?.baseUrl || window.BoyceBackend?.baseUrl || 'https://api.boycelab.com';
  const ICON_MAX_SOURCE_BYTES = 5 * 1024 * 1024;
  const ICON_MAX_DATA_LENGTH = 180000;
  let retryScheduled = false;

  function safeIconData(value) {
    const icon = String(value || '');
    return icon.length <= ICON_MAX_DATA_LENGTH && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(icon) ? icon : '';
  }

  function createFriendCard(friend) {
    const card = document.createElement('a');
    card.className = 'friend-card';
    card.href = friend.site_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const top = document.createElement('span');
    top.className = 'friend-card-top';

    const iconData = safeIconData(friend.icon_data);
    if (iconData) {
      const icon = document.createElement('img');
      icon.className = 'friend-icon';
      icon.src = iconData;
      icon.alt = '';
      icon.loading = 'lazy';
      top.appendChild(icon);
      card.classList.add('has-icon');
    }

    const identity = document.createElement('span');
    identity.className = 'friend-identity';

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

    const arrow = document.createElement('span');
    arrow.className = 'friend-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';

    identity.append(name, domain);
    top.append(identity, arrow);

    const footer = document.createElement('span');
    footer.className = 'friend-card-footer';
    footer.innerHTML = '<span>VISIT WEBSITE</span><i></i>';

    card.append(top, description, footer);
    return card;
  }

  function renderEmpty(container, message) {
    container.replaceChildren();
    const empty = document.createElement('div');
    empty.className = 'friend-empty';
    empty.textContent = message;
    container.appendChild(empty);
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('無法讀取這張圖片'));
      };
      image.src = objectUrl;
    });
  }

  async function compressIcon(file) {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      throw new Error('僅支援 PNG、JPG 或 WebP 圖片');
    }
    if (file.size > ICON_MAX_SOURCE_BYTES) throw new Error('原始圖片不可超過 5MB');

    const image = await readImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d', { alpha: true });
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = (image.naturalWidth - sourceSize) / 2;
    const sourceY = (image.naturalHeight - sourceSize) / 2;
    context.clearRect(0, 0, 256, 256);
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 256, 256);

    let dataUrl = canvas.toDataURL('image/webp', 0.82);
    if (dataUrl.length > ICON_MAX_DATA_LENGTH) {
      const compact = document.createElement('canvas');
      compact.width = 160;
      compact.height = 160;
      compact.getContext('2d').drawImage(canvas, 0, 0, 160, 160);
      dataUrl = compact.toDataURL('image/webp', 0.7);
    }
    if (dataUrl.length > ICON_MAX_DATA_LENGTH) throw new Error('圖片內容太複雜，請改用較小的 Icon');
    return dataUrl;
  }

  function setupIconUpload(form, status) {
    const input = form.querySelector('#friendIcon');
    const preview = form.querySelector('#friendIconPreview');
    const placeholder = form.querySelector('#friendIconPlaceholder');
    const removeButton = form.querySelector('#friendIconRemove');
    let iconData = '';

    function reset() {
      iconData = '';
      input.value = '';
      preview.src = '';
      preview.hidden = true;
      placeholder.hidden = false;
      removeButton.hidden = true;
    }

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return reset();
      status.className = 'form-status';
      status.textContent = '正在安全處理與壓縮網站 Icon…';
      try {
        iconData = await compressIcon(file);
        preview.src = iconData;
        preview.hidden = false;
        placeholder.hidden = true;
        removeButton.hidden = false;
        status.textContent = 'Icon 已完成裁切與壓縮，送出申請時會一併上傳。';
      } catch (error) {
        reset();
        status.className = 'form-status error';
        status.textContent = error.message;
      }
    });
    removeButton.addEventListener('click', reset);
    return { getValue: () => iconData, reset };
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
        renderEmpty(container, '目前無法連上友站資料服務，連線恢復後會自動重新載入。');
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
    const iconUpload = setupIconUpload(form, status);

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
        icon_data: iconUpload.getValue(),
        company: String(formData.get('company') || ''),
        client_id: window.crypto?.randomUUID?.() || `friend-${Date.now()}-${Math.random().toString(16).slice(2)}`
      };

      submitButton.disabled = true;
      status.className = 'form-status';
      status.textContent = '正在透過 Cloudflare 邊緣 API 送出申請…';

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
        iconUpload.reset();
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
