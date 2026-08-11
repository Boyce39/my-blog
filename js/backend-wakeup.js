(function () {
  'use strict';

  const API_BASE_URL = 'https://webpython-h2y7.onrender.com';
  const WAKEUP_KEY = 'boycelab_backend_wakeup_at';
  const WAKEUP_INTERVAL = 10 * 60 * 1000;
  let pendingRequest = null;

  function emit(state, detail) {
    window.dispatchEvent(new CustomEvent('boycelab:backend', {
      detail: Object.assign({ state: state }, detail || {})
    }));
  }

  function shouldWake(force) {
    if (force) return true;

    try {
      const lastWakeup = Number(sessionStorage.getItem(WAKEUP_KEY) || 0);
      return Date.now() - lastWakeup > WAKEUP_INTERVAL;
    } catch (error) {
      return true;
    }
  }

  function rememberWakeup() {
    try {
      sessionStorage.setItem(WAKEUP_KEY, String(Date.now()));
    } catch (error) {
      // Storage may be unavailable in strict privacy modes.
    }
  }

  function wake(options) {
    const force = Boolean(options && options.force);

    if (pendingRequest) return pendingRequest;
    if (!shouldWake(force)) return Promise.resolve({ state: 'recently-requested' });

    rememberWakeup();
    emit('waking');

    pendingRequest = fetch(`${API_BASE_URL}/test-api`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      credentials: 'omit',
      keepalive: true,
      headers: { Accept: 'application/json' }
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
        pendingRequest = null;
      });

    return pendingRequest;
  }

  window.BoyceBackend = {
    baseUrl: API_BASE_URL,
    wake: wake
  };

  wake();
  window.setInterval(function () {
    wake({ force: true });
  }, WAKEUP_INTERVAL);

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') wake();
  });

  window.addEventListener('online', function () {
    wake({ force: true });
  });
})();
