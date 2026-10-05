(function() {
  const searchBtn = document.getElementById('nav-search-btn');
  const searchModal = document.getElementById('search-modal');
  const closeBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  let fuse = null;
  let isFetched = false;

  const fetchSearchData = async () => {
    if (isFetched) return;
    try {
      const response = await fetch('/search.json');
      const data = await response.json();
      
      fuse = new Fuse(data, {
        keys: ['title', 'content'],
        threshold: 0.4,
        includeMatches: true,
        ignoreLocation: true
      });
      isFetched = true;
      searchInput.oninput?.();
    } catch (err) {
      console.error('Failed to fetch search data:', err);
      searchResults.innerHTML = '<div class="search-error">無法載入搜尋資料。</div>';
    }
  };

  const toggleModal = () => {
    searchModal.classList.toggle('hidden');
    searchModal.setAttribute('aria-hidden', String(searchModal.classList.contains('hidden')));
    if (!searchModal.classList.contains('hidden')) {
      searchInput.focus();
      fetchSearchData();
    } else {
      searchBtn.focus();
    }
  };

  searchBtn.onclick = (e) => {
    e.preventDefault();
    toggleModal();
  };

  closeBtn.onclick = toggleModal;
  searchModal.onclick = (e) => {
    if (e.target === searchModal) toggleModal();
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
      toggleModal();
    }
    if (e.key === 'Tab' && !searchModal.classList.contains('hidden')) {
      const controls = Array.from(searchModal.querySelectorAll('input,button,a[href]'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  searchInput.oninput = () => {
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.innerHTML = '<div class="search-empty">輸入關鍵字開始搜尋...</div>';
      return;
    }

    if (!fuse) return;

    const results = fuse.search(query).slice(0, 30);
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-empty">找不到相符的文章。</div>';
      return;
    }

    displayResults(results, query);
  };

  const displayResults = (results, query) => {
    const html = results.map(res => {
      const { item } = res;
      let content = item.content.replace(/<[^>]+>/g, '');
      const index = content.toLowerCase().indexOf(query.toLowerCase());
      let start = Math.max(0, index - 50);
      let snippet = (start > 0 ? '...' : '') + content.substring(start, start + 150) + (content.length > start + 150 ? '...' : '');
      
      // Highlight keywords
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQuery})`, 'gi');
      const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
      const highlight = value => String(value).split(regex).map((part, index) => index % 2 ? `<em class="search-keyword">${escapeHtml(part)}</em>` : escapeHtml(part)).join('');
      const highlightedTitle = highlight(item.title);
      const highlightedSnippet = highlight(snippet);
      const target = new URL(item.url, location.origin);
      if (!['http:', 'https:'].includes(target.protocol)) return '';

      return `
        <div class="search-result-item">
          <a href="${escapeHtml(target.href)}" class="search-result-title">${highlightedTitle}</a>
          <div class="search-result-content">${highlightedSnippet}</div>
        </div>
      `;
    }).join('');

    searchResults.innerHTML = html;
  };
})();
