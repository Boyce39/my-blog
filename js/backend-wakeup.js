(function () {
  'use strict';

  const API_BASE_URL = window.BoyceApiConfig?.baseUrl || 'https://api.boycelab.com';
  let pendingRequest = null;

  function emit(state, detail) {
    window.dispatchEvent(new CustomEvent('boycelab:backend', {
      detail: Object.assign({ state: state }, detail || {})
    }));
  }

  function check() {
    if (pendingRequest) return pendingRequest;
    emit('checking');

    const controller = new AbortController();
    const timer = window.setTimeout(function () {
      controller.abort();
    }, 8000);

    pendingRequest = fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then(function (response) {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        emit('ready');
        return { state: 'ready' };
      })
      .catch(function (error) {
        emit('unavailable', { error: error.message });
        return { state: 'unavailable', error: error };
      })
      .finally(function () {
        window.clearTimeout(timer);
        pendingRequest = null;
      });

    return pendingRequest;
  }

  window.BoyceBackend = {
    baseUrl: API_BASE_URL,
    check: check,
    wake: check
  };

  check();
  window.addEventListener('online', check);
})();
