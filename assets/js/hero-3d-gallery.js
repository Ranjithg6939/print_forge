/**
 * PrintForge — Interactive 3D Circular Printing Gallery
 * assets/js/hero-3d-gallery.js
 * 
 * Features:
 * - Smooth continuous clockwise 3D circular cylinder rotation.
 * - Hover on any card: pauses rotation and plays video directly on the card.
 * - Mouse leave: pauses video and resumes smooth continuous rotation.
 * - Click on any card: smoothly rotates that card to front-center, scales up in focus, and plays in-card video.
 * - Click focused card again or click stage background: smoothly unfocuses and resumes rotation.
 * - In-card sound toggle button for optional audio.
 * - No intrusive popup/theater video player.
 */

(function () {
  'use strict';

  // Global shared state
  let isGalleryPaused = false;
  let isGalleryHovered = false;
  let isAnimatingToFront = false;
  let selectedFocusedCard = null;

  document.addEventListener('DOMContentLoaded', function () {
    init3DCircularGallery();
    init3DVisitingCard();
  });

  function init3DCircularGallery() {
    const galleryWrap = document.getElementById('pf3dGalleryWrap');
    const cylinder = document.getElementById('pf3dCylinder');
    if (!galleryWrap || !cylinder) return;

    const cards = cylinder.querySelectorAll('.pf-3d-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;

    const angleStep = 360 / totalCards;
    let radius = calculateRadius();

    // 3D Motion & Interaction State (Automatic Clockwise Rotation)
    let currentAngle = 0;
    const clockwiseSpeed = 0.42; // Smooth continuous clockwise rotation
    let animationFrameId = null;
    let moveAnimationFrameId = null;

    let lastActivatedCard = null;
    let lastActivatedTime = 0;

    // Arrange cards evenly in circular 3D cylinder
    function arrangeCards() {
      radius = calculateRadius();
      cards.forEach((card, index) => {
        const angle = index * angleStep;
        if (card === selectedFocusedCard) {
          card.style.transform = `rotateY(${angle}deg) translateZ(${radius + 24}px) scale(1.10)`;
        } else {
          card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        }
      });
    }

    function calculateRadius() {
      const width = window.innerWidth;
      if (width > 1400) return 315;
      if (width > 1200) return 290;
      if (width > 992) return 260;
      if (width > 576) return 220;
      return 185;
    }

    arrangeCards();
    window.addEventListener('resize', debounce(arrangeCards, 150));

    function updateCardLighting() {
      cards.forEach((card, index) => {
        const cardAngle = (currentAngle + index * angleStep);
        const rad = (cardAngle * Math.PI) / 180;
        const cos = Math.cos(rad);

        if (cos > 0.90 && !selectedFocusedCard) {
          card.classList.add('is-front-focus');
        } else if (!selectedFocusedCard) {
          card.classList.remove('is-front-focus');
        }

        const brightness = (0.76 + 0.24 * Math.max(0, cos)).toFixed(2);
        const cardImg = card.querySelector('.pf-3d-card-img');
        if (cardImg && !card.classList.contains('is-video-playing')) {
          cardImg.style.filter = `saturate(1.18) contrast(1.05) brightness(${brightness})`;
        }
      });
    }

    // Continuous Automatic Clockwise 3D Circular Motion Loop (Stops when hovered or card focused)
    function renderLoop() {
      if (!isAnimatingToFront && !isGalleryPaused && !isGalleryHovered && !selectedFocusedCard) {
        currentAngle -= clockwiseSpeed; // Clockwise rotation
        cylinder.style.transform = `rotateX(-2.5deg) rotateY(${currentAngle}deg)`;
        updateCardLighting();
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    }

    renderLoop();

    // ===================================================================
    // Card Activation: Move to Front-Center, Play In-Card Video
    // ===================================================================
    function handleCardActivation(card) {
      if (!card) return;
      const now = performance.now();
      if (lastActivatedCard === card && (now - lastActivatedTime) < 350) return;
      lastActivatedCard = card;
      lastActivatedTime = now;

      // If clicked card is ALREADY focused at front, click again to unfocus and resume rotation
      if (selectedFocusedCard === card && !isAnimatingToFront) {
        resetFocusCard();
        return;
      }

      bringCardToFrontAndPlay(card);
    }

    function bringCardToFrontAndPlay(card) {
      if (!card) return;

      const cardIndex = parseInt(card.getAttribute('data-index'), 10);
      if (isNaN(cardIndex)) return;

      // 1. Pause continuous rotation immediately
      isGalleryPaused = true;
      isAnimatingToFront = true;

      // Cancel any ongoing move animation
      if (moveAnimationFrameId) {
        cancelAnimationFrame(moveAnimationFrameId);
        moveAnimationFrameId = null;
      }

      // Reset previous card if any
      if (selectedFocusedCard && selectedFocusedCard !== card) {
        selectedFocusedCard.classList.remove('is-selected-focus', 'is-video-playing');
        const prevVid = selectedFocusedCard.querySelector('.pf-3d-card-vid');
        if (prevVid) {
          try {
            prevVid.pause();
            prevVid.currentTime = parseFloat(prevVid.getAttribute('data-start-time')) || 0;
          } catch (e) {}
        }
        const prevIdx = parseInt(selectedFocusedCard.getAttribute('data-index'), 10);
        selectedFocusedCard.style.transform = `rotateY(${prevIdx * angleStep}deg) translateZ(${radius}px)`;
        selectedFocusedCard = null;
      }

      // 2. Calculate shortest rotational path so clicked card lands at visual front-center (0 deg)
      const currentCardVisualAngle = ((currentAngle + cardIndex * angleStep) % 360 + 360) % 360;
      let angleDelta = -currentCardVisualAngle;
      if (angleDelta < -180) angleDelta += 360;
      if (angleDelta > 180) angleDelta -= 360;

      const startAngle = currentAngle;
      const targetAngle = currentAngle + angleDelta;
      const duration = 650; // Smooth 3D revolve animation
      const startTime = performance.now();

      function animateToFront(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth quintic out ease
        const ease = 1 - Math.pow(1 - progress, 4);

        currentAngle = startAngle + (targetAngle - startAngle) * ease;
        cylinder.style.transform = `rotateX(-2.5deg) rotateY(${currentAngle}deg)`;
        updateCardLighting();

        if (progress < 1) {
          moveAnimationFrameId = requestAnimationFrame(animateToFront);
        } else {
          // Card has reached front-center position
          currentAngle = targetAngle;
          cylinder.style.transform = `rotateX(-2.5deg) rotateY(${currentAngle}deg)`;
          updateCardLighting();
          isAnimatingToFront = false;
          moveAnimationFrameId = null;

          // 3. Highlight selected front card
          selectedFocusedCard = card;
          card.classList.add('is-selected-focus');
          const baseAngle = cardIndex * angleStep;
          card.style.transform = `rotateY(${baseAngle}deg) translateZ(${radius + 24}px) scale(1.10)`;

          // 4. Play video seamlessly on front card
          const cardVid = card.querySelector('.pf-3d-card-vid');
          if (cardVid) {
            card.classList.add('is-video-playing');
            const startTimeSec = parseFloat(cardVid.getAttribute('data-start-time')) || 0;
            if (cardVid.currentTime === 0 && startTimeSec > 0) {
              try { cardVid.currentTime = startTimeSec; } catch (e) {}
            }
            const playPromise = cardVid.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {});
            }
          }
        }
      }

      moveAnimationFrameId = requestAnimationFrame(animateToFront);
    }

    function resetFocusCard() {
      isGalleryPaused = false;
      isGalleryHovered = false;
      isAnimatingToFront = false;

      if (moveAnimationFrameId) {
        cancelAnimationFrame(moveAnimationFrameId);
        moveAnimationFrameId = null;
      }

      cards.forEach(card => {
        card.classList.remove('is-selected-focus', 'is-video-playing');
        const cardVid = card.querySelector('.pf-3d-card-vid');
        if (cardVid) {
          try {
            cardVid.pause();
            cardVid.currentTime = parseFloat(cardVid.getAttribute('data-start-time')) || 0;
          } catch (e) {}
        }
        const idx = parseInt(card.getAttribute('data-index'), 10);
        card.style.transform = `rotateY(${idx * angleStep}deg) translateZ(${radius}px)`;
      });

      selectedFocusedCard = null;
    }

    window.reset3DGalleryFocus = resetFocusCard;

    // Hover on card: pause rotation to let user click comfortably (no video on hover)
    // Leave card: resume rotation if no card is focused
    cards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        if (isAnimatingToFront) return;
        isGalleryHovered = true;
      });

      card.addEventListener('mouseleave', function () {
        if (isAnimatingToFront) return;
        isGalleryHovered = false;
      });

      card.addEventListener('click', function (e) {
        // If clicking on cancel / close button, cancel video and reset focus
        if (e.target.closest('.pf-card-close-btn')) {
          e.stopPropagation();
          resetFocusCard();
          return;
        }
        e.stopPropagation();
        handleCardActivation(card);
      });
    });

    // Clicking anywhere on gallery background unfocuses card and resumes rotation
    galleryWrap.addEventListener('click', function (e) {
      if (!e.target.closest('.pf-3d-card')) {
        resetFocusCard();
      }
    });
  }

  // ===================================================================
  // PRINTFORGE 3D 360-DEGREE VISITING CARD CONTROLLER
  // ===================================================================
  function init3DVisitingCard() {
    const showcase = document.getElementById('pfVcardShowcase');
    const flipper = document.getElementById('pfVcardFlipper');
    if (!showcase || !flipper) return;

    const toggleBtn = document.getElementById('pfVcardToggleSpin');
    const spinIcon = document.getElementById('pfSpinIcon');
    const spinText = document.getElementById('pfSpinText');
    const frontBtn = document.getElementById('pfVcardFrontBtn');
    const backBtn = document.getElementById('pfVcardBackBtn');

    let isSpinning = true;

    function resumeSpin() {
      flipper.classList.remove('is-locked-front', 'is-locked-back', 'is-paused');
      isSpinning = true;
      if (spinIcon) spinIcon.className = 'bi bi-pause-fill';
      if (spinText) spinText.textContent = 'Pause Spin';
      if (toggleBtn) toggleBtn.classList.remove('active');
      if (frontBtn) frontBtn.classList.remove('active');
      if (backBtn) backBtn.classList.remove('active');
    }

    function pauseSpin() {
      flipper.classList.add('is-paused');
      flipper.classList.remove('is-locked-front', 'is-locked-back');
      isSpinning = false;
      if (spinIcon) spinIcon.className = 'bi bi-play-fill';
      if (spinText) spinText.textContent = 'Resume 360°';
      if (toggleBtn) toggleBtn.classList.add('active');
      if (frontBtn) frontBtn.classList.remove('active');
      if (backBtn) backBtn.classList.remove('active');
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        if (isSpinning) {
          pauseSpin();
        } else {
          resumeSpin();
        }
      });
    }

    if (frontBtn) {
      frontBtn.addEventListener('click', function () {
        flipper.classList.remove('is-paused', 'is-locked-back');
        flipper.classList.add('is-locked-front');
        isSpinning = false;
        if (spinIcon) spinIcon.className = 'bi bi-arrow-repeat';
        if (spinText) spinText.textContent = 'Spin 360°';
        frontBtn.classList.add('active');
        if (backBtn) backBtn.classList.remove('active');
        if (toggleBtn) toggleBtn.classList.remove('active');
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        flipper.classList.remove('is-paused', 'is-locked-front');
        flipper.classList.add('is-locked-back');
        isSpinning = false;
        if (spinIcon) spinIcon.className = 'bi bi-arrow-repeat';
        if (spinText) spinText.textContent = 'Spin 360°';
        backBtn.classList.add('active');
        if (frontBtn) frontBtn.classList.remove('active');
        if (toggleBtn) toggleBtn.classList.remove('active');
      });
    }

    // Interactive mouse tilt when hovering paused or locked card
    const stage = showcase.querySelector('.pf-vcard-stage');
    if (stage) {
      stage.addEventListener('mousemove', function (e) {
        if (isSpinning) return;
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = -(y / (rect.height / 2)) * 14;
        const tiltY = (x / (rect.width / 2)) * 14;

        if (flipper.classList.contains('is-locked-back')) {
          flipper.style.transform = `rotateY(${180 + tiltY}deg) rotateX(${tiltX}deg)`;
        } else if (flipper.classList.contains('is-locked-front')) {
          flipper.style.transform = `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`;
        }
      });

      stage.addEventListener('mouseleave', function () {
        if (flipper.classList.contains('is-locked-back')) {
          flipper.style.transform = '';
        } else if (flipper.classList.contains('is-locked-front')) {
          flipper.style.transform = '';
        }
      });
    }
  }

  // Debounce helper
  function debounce(fn, wait) {
    let timeout;
    return function () {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }
})();
