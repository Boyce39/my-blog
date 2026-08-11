(function () {
  'use strict';

  const formSelector = '.boyce-subscribe-form, .landing-subscribe';
  const sinkName = 'boycelab-subscribe-sink';
  let modal = null;
  let previousFocus = null;

  if (window.__boyceSubscribeReady) return;
  window.__boyceSubscribeReady = true;

  function createSubmissionSink() {
    let sink = document.querySelector(`iframe[name="${sinkName}"]`);
    if (sink) return sink;

    sink = document.createElement('iframe');
    sink.name = sinkName;
    sink.title = '電子報背景傳送通道';
    sink.className = 'subscribe-submission-sink';
    sink.setAttribute('aria-hidden', 'true');
    sink.tabIndex = -1;
    document.body.appendChild(sink);
    return sink;
  }

  function createModal() {
    if (document.getElementById('tech-subscribe-modal')) {
      return document.getElementById('tech-subscribe-modal');
    }

    const template = document.createElement('template');
    template.innerHTML = `
      <div id="tech-subscribe-modal" class="tech-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="tech-modal-heading" aria-describedby="tech-modal-message" hidden>
        <div class="tech-modal-content">
          <div class="tech-modal-grid" aria-hidden="true"></div>
          <header class="tech-modal-header">
            <span><i></i> BOYCELAB / SIGNAL RECEIVED</span>
            <button class="tech-modal-close" type="button" aria-label="關閉訂閱訊息">×</button>
          </header>
          <div class="tech-modal-body">
            <div class="tech-modal-signal" aria-hidden="true">
              <span></span><span></span><span></span>
              <svg viewBox="0 0 64 64"><path d="M14 48a24 24 0 0 1 36 0M21 40a15 15 0 0 1 22 0M29 32a5 5 0 0 1 6 0"/><circle cx="32" cy="50" r="3"/></svg>
            </div>
            <p id="tech-modal-kicker" class="tech-modal-kicker">TRANSMISSION COMPLETE</p>
            <h2 id="tech-modal-heading">訂閱成功</h2>
            <p id="tech-modal-message">歡迎加入 BoyceLab 電子報。之後會不定期收到最新技術筆記、AI 研究與資安內容。</p>
            <div class="tech-modal-meta"><span>STATUS <b id="tech-modal-status">200 / OK</b></span><span>CHANNEL <b>NEWSLETTER</b></span></div>
          </div>
          <footer class="tech-modal-footer">
            <button class="tech-modal-confirm" type="button">確認並返回網站 <span>→</span></button>
          </footer>
        </div>
      </div>`;
    document.body.appendChild(template.content);
    modal = document.getElementById('tech-subscribe-modal');

    modal.querySelector('.tech-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.tech-modal-confirm').addEventListener('click', closeModal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal();
    });
    return modal;
  }

  function openModal(type, message) {
    const activeModal = createModal();
    const success = type === 'success';
    previousFocus = document.activeElement;
    activeModal.classList.toggle('is-error', !success);
    activeModal.querySelector('#tech-modal-kicker').textContent = success ? 'TRANSMISSION COMPLETE' : 'TRANSMISSION INTERRUPTED';
    activeModal.querySelector('#tech-modal-heading').textContent = success ? '訂閱成功' : '暫時無法訂閱';
    activeModal.querySelector('#tech-modal-message').textContent = message;
    activeModal.querySelector('#tech-modal-status').textContent = success ? '200 / OK' : '503 / RETRY';
    activeModal.hidden = false;
    document.body.classList.add('tech-modal-open');
    window.requestAnimationFrame(function () {
      activeModal.classList.add('active');
      activeModal.querySelector('.tech-modal-confirm').focus();
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('tech-modal-open');
    window.setTimeout(function () {
      modal.hidden = true;
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    }, 220);
  }

  function validEmail(input) {
    const value = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    input.setCustomValidity(valid ? '' : '請輸入有效的 Email 地址');
    return valid;
  }

  function submitSubscription(form) {
    const emailInput = form.querySelector('input[name="EMAIL"]');
    if (!emailInput || !validEmail(emailInput) || !form.reportValidity()) {
      if (emailInput) emailInput.focus();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalContent = submitButton ? submitButton.innerHTML : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('is-sending');
      submitButton.innerHTML = '<span class="subscribe-spinner" aria-hidden="true"></span> 訊號傳送中…';
    }

    try {
      createSubmissionSink();
      const originalTarget = form.getAttribute('target');
      form.setAttribute('target', sinkName);
      HTMLFormElement.prototype.submit.call(form);
      if (originalTarget === null) form.removeAttribute('target');
      else form.setAttribute('target', originalTarget);

      form.reset();
      openModal('success', '歡迎加入 BoyceLab 電子報。之後會不定期收到最新技術筆記、AI 研究與資安內容。');
    } catch (error) {
      openModal('error', '訊號目前沒有成功送達，請確認網路連線後再試一次。');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('is-sending');
        submitButton.innerHTML = originalContent;
      }
    }
  }

  function init() {
    createModal();
    createSubmissionSink();
    document.addEventListener('submit', function (event) {
      const form = event.target.closest(formSelector);
      if (!form) return;
      event.preventDefault();
      submitSubscription(form);
    }, true);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal && !modal.hidden) closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
