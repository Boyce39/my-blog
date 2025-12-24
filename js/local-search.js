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
    } catch (err) {
      console.error('Failed to fetch search data:', err);
      searchResults.innerHTML = '<div class="search-error">無法載入搜尋資料。</div>';
    }
  };

  const toggleModal = () => {
    searchModal.classList.toggle('hidden');
    if (!searchModal.classList.contains('hidden')) {
      searchInput.focus();
      fetchSearchData();
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
  });

  searchInput.oninput = () => {
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.innerHTML = '<div class="search-empty">輸入關鍵字開始搜尋...</div>';
      return;
    }

    if (!fuse) return;

    const results = fuse.search(query);
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
      const regex = new RegExp(`(${query})`, 'gi');
      const highlightedTitle = item.title.replace(regex, '<em class="search-keyword">$1</em>');
      const highlightedSnippet = snippet.replace(regex, '<em class="search-keyword">$1</em>');

      return `
        <div class="search-result-item">
          <a href="${item.url}" class="search-result-title">${highlightedTitle}</a>
          <div class="search-result-content">${highlightedSnippet}</div>
        </div>
      `;
    }).join('');

    searchResults.innerHTML = html;
  };
})();
