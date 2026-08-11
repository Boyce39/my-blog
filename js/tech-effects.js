(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardSelector = [
    '.focus-card',
    '.project-card',
    '.milestone-item',
    '.friend-card',
    '.friends-panel',
    '.newsletter-panel',
    '.anonymous-panel',
    '.anonymous-card',
    '.community-form-panel',
    '.subscribe-section',
    '.post-list-item',
    '.archive-post'
  ].join(',');

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    let ticking = false;
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      progressBar.style.transform = `scaleX(${progress / 100})`;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initCardEffects() {
    const cards = Array.from(document.querySelectorAll(cardSelector));
    if (!cards.length) return;

    const observer = !reducedMotion && 'IntersectionObserver' in window
      ? new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('tech-card-visible');
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -24px' })
      : null;

    cards.forEach(function (card, index) {
      if (card.querySelector(':scope > .tech-card-glow')) return;
      card.classList.add('tech-card-enhanced');

      const glow = document.createElement('span');
      glow.className = 'tech-card-glow';
      glow.setAttribute('aria-hidden', 'true');
      card.appendChild(glow);

      if (!reducedMotion) {
        card.style.setProperty('--tech-delay', `${Math.min(index % 6, 5) * 38}ms`);
        card.addEventListener('pointermove', function (event) {
          if (event.pointerType === 'touch') return;
          const bounds = card.getBoundingClientRect();
          card.style.setProperty('--tech-card-x', `${event.clientX - bounds.left}px`);
          card.style.setProperty('--tech-card-y', `${event.clientY - bounds.top}px`);
        }, { passive: true });
        observer ? observer.observe(card) : card.classList.add('tech-card-visible');
      } else {
        card.classList.add('tech-card-visible');
      }
    });
  }

  function initAmbientNetwork() {
    if (reducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'tech-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d');
    if (!context) return;

    let particles = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = width < 700 ? 12 : Math.min(28, Math.max(18, Math.round(width / 62)));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: 0.7 + Math.random() * 1.2
        };
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      const lightTheme = document.documentElement.getAttribute('theme') === 'light';
      const nodeColor = lightTheme ? 'rgba(15, 118, 110, 0.2)' : 'rgba(103, 232, 249, 0.24)';
      const lineColor = lightTheme ? [15, 118, 110] : [45, 212, 191];

      particles.forEach(function (particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        context.fillStyle = nodeColor;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      for (let left = 0; left < particles.length; left += 1) {
        for (let right = left + 1; right < particles.length; right += 1) {
          const xDistance = particles[left].x - particles[right].x;
          const yDistance = particles[left].y - particles[right].y;
          const distance = Math.hypot(xDistance, yDistance);
          if (distance > 135) continue;
          context.strokeStyle = `rgba(${lineColor.join(',')}, ${(1 - distance / 135) * 0.1})`;
          context.lineWidth = 0.7;
          context.beginPath();
          context.moveTo(particles[left].x, particles[left].y);
          context.lineTo(particles[right].x, particles[right].y);
          context.stroke();
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        window.cancelAnimationFrame(animationFrame);
      } else {
        window.cancelAnimationFrame(animationFrame);
        draw();
      }
    });
    resize();
    draw();
  }

  function initSystemInterface() {
    if (document.getElementById('tech-interface-layer')) return;

    const interfaceLayer = document.createElement('div');
    interfaceLayer.id = 'tech-interface-layer';
    interfaceLayer.setAttribute('aria-hidden', 'true');
    interfaceLayer.innerHTML = '<i class="tech-scan-beam"></i><i class="tech-pointer-field"></i>';
    document.body.appendChild(interfaceLayer);

    const hud = document.createElement('div');
    hud.id = 'tech-hud';
    hud.setAttribute('aria-hidden', 'true');
    hud.innerHTML = `
      <i class="tech-hud-corner top-left"></i>
      <i class="tech-hud-corner top-right"></i>
      <i class="tech-hud-corner bottom-left"></i>
      <i class="tech-hud-corner bottom-right"></i>
      <span class="tech-hud-label hud-status"><b></b> BOYCELAB / ONLINE</span>
      <span class="tech-hud-label hud-coordinate">NCHU · AMATH · ${new Date().getFullYear()}</span>`;
    document.body.appendChild(hud);

    if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
    let pointerFrame = 0;
    window.addEventListener('pointermove', function (event) {
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(function () {
        interfaceLayer.style.setProperty('--pointer-x', `${event.clientX}px`);
        interfaceLayer.style.setProperty('--pointer-y', `${event.clientY}px`);
      });
    }, { passive: true });
  }

  function initCopyButtons() {
    document.querySelectorAll('figure.highlight, .highlight').forEach(function (block) {
      if (block.querySelector(':scope > .copy-btn')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-btn';
      button.setAttribute('aria-label', '複製程式碼');
      button.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
      block.appendChild(button);

      button.addEventListener('click', async function () {
        const code = block.querySelector('.code, code');
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.innerText);
          button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
          window.setTimeout(function () {
            button.innerHTML = '<i class="fa-regular fa-copy" aria-hidden="true"></i>';
          }, 1800);
        } catch (error) {
          button.setAttribute('aria-label', '複製失敗');
        }
      });
    });
  }

  ready(function () {
    initSystemInterface();
    initReadingProgress();
    initCardEffects();
    initAmbientNetwork();
    initCopyButtons();
  });
})();
