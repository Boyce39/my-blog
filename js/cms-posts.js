(() => {
  'use strict';
  if (!/^\/blog\/?$/.test(location.pathname)) return;

  const API_BASE = window.BoyceApiConfig?.baseUrl || 'https://api.boycelab.com';
  let feed;
  let requestId = 0;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  function init() {
    const content = document.getElementById('content-body');
    const firstArticle = content?.querySelector('article.article-index-card');
    if (!content || !firstArticle) return;
    feed = document.createElement('section');
    feed.className = 'cms-post-feed';
    feed.hidden = true;
    content.insertBefore(feed, firstArticle);
    loadPosts();
    window.addEventListener('boycelab:languagechange', loadPosts);
  }

  async function loadPosts() {
    const activeRequest = ++requestId;
    const locale = window.BoyceI18n?.locale || detectLocale();
    try {
      const response = await fetch(`${API_BASE}/posts?locale=${encodeURIComponent(locale)}&page=1&per_page=20`, { headers: { Accept: 'application/json' }, cache: 'no-store', credentials: 'omit' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Unable to load posts');
      if (activeRequest !== requestId) return;
      const posts = Array.isArray(payload.posts) ? payload.posts : [];
      if (!posts.length) { feed.hidden = true; return; }
      render(posts, locale);
    } catch (error) {
      console.warn('BoyceLab CMS posts unavailable', error);
      feed.hidden = true;
    }
  }

  function render(posts, locale) {
    const copy = {
      'zh-TW': ['最新發布', '由 BoyceLab 文章工作室發布的多語言內容'],
      en: ['Latest posts', 'Multilingual articles published from BoyceLab Content Studio'],
      ja: ['最新記事', 'BoyceLab Content Studioから公開された多言語記事'],
      ko: ['최신 글', 'BoyceLab Content Studio에서 발행한 다국어 글']
    }[locale] || ['最新發布', '由 BoyceLab 文章工作室發布的多語言內容'];
    feed.innerHTML = `<header class="cms-feed-heading"><div><span>BOYCELAB / EDGE PUBLISHING</span><h2>${copy[0]}</h2></div><p>${copy[1]}</p></header><div class="cms-feed-grid">${posts.map(post => renderCard(post, locale)).join('')}</div>`;
    feed.hidden = false;
  }

  function renderCard(post, locale) {
    const published = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Taipei' }).format(new Date(post.published_at || post.updated_at));
    const fallback = post.locale !== locale ? `<span class="cms-feed-fallback">${escapeHtml(post.locale)}</span>` : '';
    const cover = post.cover_image_url ? `<img src="${escapeHtml(post.cover_image_url)}" alt="${escapeHtml(post.cover_image_alt || post.title)}" loading="lazy">` : '<span class="cms-feed-signal" aria-hidden="true">B</span>';
    return `<article class="cms-feed-card"><a href="${escapeHtml(post.url)}?lang=${encodeURIComponent(locale)}"><div class="cms-feed-cover">${cover}</div><div class="cms-feed-copy"><div class="cms-feed-meta"><time>${escapeHtml(published)}</time>${fallback}</div><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.excerpt)}</p><div class="cms-feed-tags">${(post.tags || []).slice(0, 4).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div></div></a></article>`;
  }

  function detectLocale() {
    const input = String(navigator.language || '').toLowerCase();
    if (input.startsWith('ja')) return 'ja';
    if (input.startsWith('ko')) return 'ko';
    if (input.startsWith('en')) return 'en';
    return 'zh-TW';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }
})();
