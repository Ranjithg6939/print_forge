/**
 * PrintForge – Interactive 3D Dot Grid Wave (dot-grid-wave.js)
 * Implements strictly localized 3D water-wave deformation:
 * Only dots near the moving mouse cursor displace and flow;
 * dots outside the cursor's influence remain completely still in their uniform grid.
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function initDotWave() {
    let canvas = document.getElementById('waveCanvas') || document.getElementById('dotGridCanvas');
    let isStandalone = false;

    if (canvas) {
      isStandalone = true;
    } else {
      canvas = document.getElementById('pf-interactive-dot-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'pf-interactive-dot-canvas';
        document.body.prepend(canvas);
      }
      document.body.classList.add('pf-interactive-dots-active');
    }

    const ctx = canvas.getContext('2d', { alpha: !isStandalone });
    if (!ctx) return;

    // Configuration: localized interaction radius
    const CONFIG = {
      gridSpacing: isStandalone ? 16.0 : 22.0,
      dotBaseRadius: isStandalone ? 1.3 : 1.35,
      influenceRadius: 165.0,   // ONLY dots within this radius move
      waveAmplitude: 28.0,      // Height of 3D wave around cursor
      radialPush: 16.0,         // Radial fluid bunching into crests
      focalLength: 580.0,       // 3D perspective depth
      mouseLag: 0.16,           // Fluid cursor follow speed
      returnSpeed: 0.20         // Spring-back speed when mouse departs
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let totalDots = 0;

    let basePositions;
    let renderX;
    let renderY;
    let renderZ;

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      active: false,
      idleTimer: null
    };

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initGrid();
    }

    function initGrid() {
      const spacing = CONFIG.gridSpacing;
      cols = Math.ceil(width / spacing) + 4;
      rows = Math.ceil(height / spacing) + 4;
      totalDots = cols * rows;

      const offsetX = (width - (cols - 1) * spacing) * 0.5;
      const offsetY = (height - (rows - 1) * spacing) * 0.5;

      basePositions = new Float32Array(totalDots * 2);
      renderX = new Float32Array(totalDots);
      renderY = new Float32Array(totalDots);
      renderZ = new Float32Array(totalDots);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const x0 = offsetX + c * spacing;
          const y0 = offsetY + r * spacing;

          basePositions[idx * 2] = x0;
          basePositions[idx * 2 + 1] = y0;
          renderX[idx] = x0;
          renderY[idx] = y0;
          renderZ[idx] = 0;
        }
      }
    }

    function onPointerMove(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = clientX - rect.left;
      mouse.targetY = clientY - rect.top;

      if (!mouse.active) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
        mouse.active = true;
      }
    }

    function onPointerLeave() {
      mouse.active = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    }

    window.addEventListener('mousemove', (e) => {
      onPointerMove(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('mouseleave', onPointerLeave, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onPointerLeave, { passive: true });
    window.addEventListener('touchcancel', onPointerLeave, { passive: true });
    window.addEventListener('resize', resize, { passive: true });

    function render() {
      requestAnimationFrame(render);

      // Interpolate mouse movement
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * CONFIG.mouseLag;
        mouse.y += (mouse.targetY - mouse.y) * CONFIG.mouseLag;

        mouse.vx = mouse.x - mouse.prevX;
        mouse.vy = mouse.y - mouse.prevY;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
        mouse.vx = 0;
        mouse.vy = 0;
      }

      // Clear frame
      if (isStandalone) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      const isDark = isStandalone || document.documentElement.getAttribute('data-theme') === 'dark';

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const fov = CONFIG.focalLength;
      const R = CONFIG.influenceRadius;
      const RSq = R * R;
      const A = CONFIG.waveAmplitude;
      const radialPush = CONFIG.radialPush;
      const baseRadius = CONFIG.dotBaseRadius;
      const returnLerp = CONFIG.returnSpeed;

      const mx = mouse.x;
      const my = mouse.y;
      const vx = mouse.vx;
      const vy = mouse.vy;
      const isMouseOnScreen = mouse.active && mx > -R && mx < width + R && my > -R && my < height + R;

      for (let i = 0; i < totalDots; i++) {
        const pIdx = i * 2;
        const x0 = basePositions[pIdx];
        const y0 = basePositions[pIdx + 1];

        let targetX = x0;
        let targetY = y0;
        let targetZ = 0;

        // ONLY deform dots strictly within the mouse influence radius
        if (isMouseOnScreen) {
          const dx = x0 - mx;
          const dy = y0 - my;

          // Quick bounding box check
          if (Math.abs(dx) < R && Math.abs(dy) < R) {
            const distSq = dx * dx + dy * dy;

            if (distSq < RSq) {
              const r = Math.sqrt(distSq);
              const u = r / R; // 0 at cursor, 1 at boundary
              // Smooth envelope going to exactly 0 at boundary with zero slope
              const envelope = (1 - u) * (1 - u);

              // 3D wave oscillation profile
              const angle = u * Math.PI * 2.5;
              const waveHeight = Math.cos(angle);
              const waveRadial = Math.sin(angle);

              targetZ = A * waveHeight * envelope;

              // Radial pinch/crest deformation
              const dr = -radialPush * waveRadial * envelope;
              const invR = 1.0 / (r + 0.0001);
              targetX = x0 + dx * invR * dr;
              targetY = y0 + dy * invR * dr;

              // Fluid wake drag along mouse movement direction
              const wake = envelope * 0.35;
              targetX += vx * wake;
              targetY += vy * wake;
            }
          }
        }

        // Smooth spring return to equilibrium
        const curX = renderX[i] + (targetX - renderX[i]) * returnLerp;
        const curY = renderY[i] + (targetY - renderY[i]) * returnLerp;
        const curZ = renderZ[i] + (targetZ - renderZ[i]) * returnLerp;

        renderX[i] = curX;
        renderY[i] = curY;
        renderZ[i] = curZ;

        // 3D Perspective Projection
        let screenX, screenY, dotRadius, alpha;

        if (Math.abs(curZ) > 0.05) {
          const scale = fov / (fov - curZ);
          screenX = centerX + (curX - centerX) * scale;
          screenY = centerY + (curY - centerY) * scale;
          dotRadius = Math.max(0.65, baseRadius * scale);

          const zNorm = curZ / (A + 0.001);
          if (isDark) {
            alpha = Math.min(1.0, Math.max(0.35, 0.72 + zNorm * 0.32));
          } else {
            alpha = Math.min(0.65, Math.max(0.20, 0.38 + zNorm * 0.25));
          }
        } else {
          // Exactly at rest: standard grid coordinate
          screenX = curX;
          screenY = curY;
          dotRadius = baseRadius;
          alpha = isDark ? 0.70 : 0.35;
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, dotRadius, 0, 6.2831853);
        if (isDark) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        } else {
          ctx.fillStyle = `rgba(94, 39, 130, ${alpha.toFixed(2)})`;
        }
        ctx.fill();
      }
    }

    resize();
    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDotWave);
  } else {
    initDotWave();
  }
})();
