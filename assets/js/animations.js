/**
 * PrintForge – Animations Controller (animations.js)
 * Implements headline reveals, scroll reveal, number counters, and reduced-motion checks.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initCounters();
    initHeadlineEffects();
    initBadgeTyping();
    initTagLetterWave();
  });

  // IntersectionObserver for scroll-triggered reveal
  function initScrollReveal() {
    if (prefersReducedMotion) return;

    const revealElements = document.querySelectorAll('.pf-reveal, .pf-reveal-up, .pf-reveal-left, .pf-reveal-right');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.style.transition = 'opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)';
      el.style.opacity = '0';
      
      if (el.classList.contains('pf-reveal-left')) {
        el.style.transform = 'translateX(-30px)';
      } else if (el.classList.contains('pf-reveal-right')) {
        el.style.transform = 'translateX(30px)';
      } else {
        el.style.transform = 'translateY(30px)';
      }
      
      observer.observe(el);
    });

    // Helper class added on reveal
    const style = document.createElement('style');
    style.innerHTML = `
      .is-revealed {
        opacity: 1 !important;
        transform: translate(0, 0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Number Counter Animation
  function initCounters() {
    const counterElements = document.querySelectorAll('.counter-value');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseFloat(target.getAttribute('data-target') || target.innerText.replace(/[^0-9.]/g, ''));
          const suffix = target.getAttribute('data-suffix') || '';
          const prefix = target.getAttribute('data-prefix') || '';
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = Math.floor(easeOutProgress * endValue);
            
            target.innerText = prefix + currentNum.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.innerText = prefix + endValue.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // Word-by-word headline reveal effect
  function initHeadlineEffects() {
    if (prefersReducedMotion) return;
    const splitElements = document.querySelectorAll('.pf-split-text');

    splitElements.forEach(el => {
      const words = el.innerText.trim().split(' ');
      el.innerHTML = words.map(w => `<span class="pf-word-wrap" style="display:inline-block; overflow:hidden;"><span class="pf-word" style="display:inline-block; transform:translateY(110%); transition:transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);">${w}</span></span>`).join(' ');

      const headlineObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const wordSpans = entry.target.querySelectorAll('.pf-word');
            wordSpans.forEach((sp, idx) => {
              setTimeout(() => {
                sp.style.transform = 'translateY(0)';
              }, idx * 70);
            });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      headlineObserver.observe(el);
    });
  }

  // Dynamic typing reveal animation for section badges
  function initBadgeTyping() {
    if (prefersReducedMotion) return;
    const badges = document.querySelectorAll('.pf-badge');
    if (!badges.length) return;

    const badgeObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const badge = entry.target;
          obs.unobserve(badge);

          const icon = badge.querySelector('i');
          const iconHTML = icon ? icon.outerHTML : '';
          
          const clone = badge.cloneNode(true);
          const cloneIcon = clone.querySelector('i');
          if (cloneIcon) cloneIcon.remove();
          const text = clone.textContent.trim();
          if (!text) return;

          badge.innerHTML = (iconHTML ? iconHTML + ' ' : '') + '<span class="pf-badge-text"></span><span class="pf-badge-cursor">|</span>';
          const textSpan = badge.querySelector('.pf-badge-text');

          let charIdx = 0;
          const speed = 28;

          function typeNext() {
            if (charIdx < text.length) {
              textSpan.textContent += text.charAt(charIdx);
              charIdx++;
              setTimeout(typeNext, speed);
            } else {
              const cursor = badge.querySelector('.pf-badge-cursor');
              if (cursor) {
                setTimeout(() => {
                  cursor.style.opacity = '0';
                  setTimeout(() => cursor.remove(), 400);
                }, 800);
              }
            }
          }

          setTimeout(typeNext, 120);
        }
      });
    }, { threshold: 0.15 });

    badges.forEach(b => badgeObserver.observe(b));
  }

  // Continuous undulating wave & interactive letter animation for image tags / pills (.pf-box-img-tag)
  function initTagLetterWave() {
    const tags = document.querySelectorAll('.pf-box-img-tag');
    if (!tags.length) return;

    tags.forEach(tag => {
      if (tag.dataset.waveReady === 'true') return;
      tag.dataset.waveReady = 'true';

      const rawText = tag.textContent.replace(/\|/g, '').trim();
      if (!rawText) return;

      tag.setAttribute('aria-label', rawText);
      tag.innerHTML = '';

      // Pulsing Beacon Dot
      const dot = document.createElement('span');
      dot.className = 'pf-tag-dot';
      tag.appendChild(dot);

      // Letters wrapper
      const charsWrap = document.createElement('span');
      charsWrap.className = 'pf-tag-chars';

      let charIndex = 0;
      for (const ch of rawText) {
        if (ch === ' ') {
          const space = document.createElement('span');
          space.className = 'pf-char-space';
          space.innerHTML = '&nbsp;';
          charsWrap.appendChild(space);
        } else {
          const charSpan = document.createElement('span');
          charSpan.className = 'pf-char';
          charSpan.textContent = ch;
          charSpan.style.setProperty('--char-idx', charIndex);
          charsWrap.appendChild(charSpan);
          charIndex++;
        }
      }
      tag.appendChild(charsWrap);
    });
  }
  window.pfInitTagTyping = initTagLetterWave;
  window.pfInitTagLetterWave = initTagLetterWave;

  // Automatically initialize interactive 3D dot grid wave if not yet present
  if (!document.getElementById('pf-interactive-dot-canvas') && !document.querySelector('script[src*="dot-grid-wave.js"]')) {
    const script = document.createElement('script');
    script.src = 'assets/js/dot-grid-wave.js';
    document.body.appendChild(script);
  }
})();
