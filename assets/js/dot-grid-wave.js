/**
 * PrintForge – Premium Interactive Liquid Wave Dot Animation (dot-grid-wave.js)
 *
 * Implements a high-quality, physics-based liquid wave disturbance across an evenly spaced dot grid:
 * 1. Evenly spaced, subtle, minimal circular dot grid background matching website colors.
 * 2. Mouse-driven continuous liquid wave disturbance originating at previous cursor positions.
 * 3. Radial water-wave propagation traveling outward through surrounding dots beyond cursor position.
 * 4. Dual vertical & horizontal sine-wave displacements with subtle secondary harmonics.
 * 5. Dynamic depth scaling: crest dots expand & deepen in opacity; trough dots gently fade.
 * 6. Smooth spring easing, natural energy decay, and seamless recovery to resting coordinates.
 * 7. Mobile/touch detection: interaction disabled, static dot grid background preserved.
 * 8. Performance optimized: IntersectionObserver viewport pause, visibility handling, Float32Array buffers.
 * 9. Non-intrusive integration: pointer-events: none canvas behind interactive elements.
 */
(function () {
  'use strict';

  // Honor user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Detect mobile & touch-only devices
  const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    (window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  function createLiquidWaveInstance(canvas, isStandalone) {
    const ctx = canvas.getContext('2d', { alpha: !isStandalone });
    if (!ctx) return null;

    // Physical & Aesthetic Parameters
    const CONFIG = {
      gridSpacing: isStandalone ? 20.0 : 22.0,
      dotBaseRadius: 1.35,
      maxRipples: 18,
      waveSpeed: 3.6,               // Wavefront expansion speed (px per frame)
      wavePacketWidth: 92.0,        // Active width of the expanding wave packet
      waveMaxRadius: 460.0,         // Radius where wave energy completely dissipates
      baseAmplitude: 26.0,          // Peak vertical displacement amplitude
      amplitudeDecay: 0.975,        // Natural distance & time decay rate per frame
      cursorImmediateRadius: 85.0,  // Immediate fluid reaction zone directly under cursor
      springEase: 0.18,             // Organic spring return speed to resting equilibrium
      emitDistanceMin: 18.0,        // Distance mouse must move to spawn the next ripple wave
      emitThrottleMs: 34            // Minimum time (ms) between continuous ripple emissions
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let totalDots = 0;

    // High-performance typed buffers
    let basePositions;  // [x0, y0, x1, y1, ...]
    let renderX;        // Current rendered X
    let renderY;        // Current rendered Y
    let renderZ;        // Current vertical displacement Z (crest/trough height)

    // Active expanding ripples pool
    const ripples = [];

    // Cursor tracking state
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      lastEmitX: -9999,
      lastEmitY: -9999,
      lastEmitTime: 0,
      active: false
    };

    // Viewport visibility state (IntersectionObserver optimization)
    let isVisible = true;
    let isDocumentVisible = true;
    let animationFrameId = null;

    function resize() {
      if (isStandalone) {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const parent = canvas.parentElement;
        if (canvas.id === 'pf-interactive-dot-canvas') {
          width = window.innerWidth;
          height = window.innerHeight;
        } else {
          width = parent ? parent.clientWidth : window.innerWidth;
          height = parent ? parent.clientHeight : window.innerHeight;
        }
      }

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initGrid();

      if (isTouchDevice) {
        drawStaticGrid();
      }
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

    // Spawn an expanding circular liquid wave at historical position (x, y)
    function spawnRipple(x, y, initialAmp = CONFIG.baseAmplitude) {
      if (ripples.length >= CONFIG.maxRipples) {
        ripples.shift();
      }

      ripples.push({
        x: x,
        y: y,
        radius: 4.0,
        amplitude: initialAmp,
        maxRadius: CONFIG.waveMaxRadius,
        speed: CONFIG.waveSpeed,
        width: CONFIG.wavePacketWidth,
        decay: CONFIG.amplitudeDecay
      });
    }

    function onPointerMove(clientX, clientY) {
      if (isTouchDevice) return;

      const rect = canvas.getBoundingClientRect();
      const currentX = clientX - rect.left;
      const currentY = clientY - rect.top;

      // Ensure cursor is within boundary
      if (currentX < -60 || currentX > rect.width + 60 || currentY < -60 || currentY > rect.height + 60) {
        mouse.active = false;
        return;
      }

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;

      const now = performance.now();
      const distFromLast = Math.hypot(currentX - mouse.lastEmitX, currentY - mouse.lastEmitY);
      const timeSinceLast = now - mouse.lastEmitTime;

      if (mouse.prevX !== -9999) {
        mouse.vx = currentX - mouse.prevX;
        mouse.vy = currentY - mouse.prevY;
      }
      mouse.prevX = currentX;
      mouse.prevY = currentY;

      // Spawn expanding liquid wave when mouse travels or continuous movement throttled
      if (distFromLast >= CONFIG.emitDistanceMin && timeSinceLast >= CONFIG.emitThrottleMs) {
        const speed = Math.hypot(mouse.vx, mouse.vy);
        const dynamicAmp = Math.min(38.0, CONFIG.baseAmplitude + speed * 0.40);
        spawnRipple(currentX, currentY, dynamicAmp);

        mouse.lastEmitX = currentX;
        mouse.lastEmitY = currentY;
        mouse.lastEmitTime = now;
      }
    }

    function onPointerDown(clientX, clientY) {
      if (isTouchDevice) return;

      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      if (px >= 0 && px <= rect.width && py >= 0 && py <= rect.height) {
        // Crisp liquid splash on click
        spawnRipple(px, py, CONFIG.baseAmplitude * 1.55);
      }
    }

    function onPointerLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.lastEmitX = -9999;
      mouse.lastEmitY = -9999;
    }

    // Attach listeners on desktop
    if (!isTouchDevice) {
      window.addEventListener('mousemove', (e) => {
        onPointerMove(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('mousedown', (e) => {
        onPointerDown(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('mouseleave', onPointerLeave, { passive: true });
    }

    window.addEventListener('resize', resize, { passive: true });

    // Viewport IntersectionObserver to pause rendering when canvas is off-screen
    if ('IntersectionObserver' in window && !isStandalone) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && isDocumentVisible && !animationFrameId && !isTouchDevice) {
            animationFrameId = requestAnimationFrame(render);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    document.addEventListener('visibilitychange', () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible && isVisible && !animationFrameId && !isTouchDevice) {
        animationFrameId = requestAnimationFrame(render);
      }
    });

    // Static grid renderer for touch/mobile devices
    function drawStaticGrid() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (isStandalone && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isStandalone) {
        ctx.fillStyle = isDark ? '#0B0410' : '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      const dotColor = isDark ? 'rgba(216, 184, 232, 0.38)' : 'rgba(121, 34, 165, 0.28)';
      ctx.fillStyle = dotColor;

      for (let i = 0; i < totalDots; i++) {
        const pIdx = i * 2;
        ctx.beginPath();
        ctx.arc(basePositions[pIdx], basePositions[pIdx + 1], CONFIG.dotBaseRadius, 0, 6.2831853);
        ctx.fill();
      }
    }

    // Main 60fps Liquid Wave Animation Loop
    function render() {
      if (isTouchDevice || !isVisible || !isDocumentVisible) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(render);

      // 1. Advance expanding ripples & cull fully decayed waves
      for (let k = ripples.length - 1; k >= 0; k--) {
        const rip = ripples[k];
        rip.radius += rip.speed;
        rip.amplitude *= rip.decay;

        if (rip.radius > rip.maxRadius || rip.amplitude < 0.20) {
          ripples.splice(k, 1);
        }
      }

      // 2. Clear canvas with correct theme background or alpha transparency
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
        (isStandalone && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isStandalone) {
        ctx.fillStyle = isDark ? '#0B0410' : '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      const baseRadius = CONFIG.dotBaseRadius;
      const ease = CONFIG.springEase;
      const hasRipples = ripples.length > 0;
      const mouseActive = mouse.active && mouse.x > -100 && mouse.x < width + 100 && mouse.y > -100 && mouse.y < height + 100;
      const immRadius = CONFIG.cursorImmediateRadius;
      const immRadiusSq = immRadius * immRadius;

      // 3. Calculate physics displacement across dot grid
      for (let i = 0; i < totalDots; i++) {
        const pIdx = i * 2;
        const x0 = basePositions[pIdx];
        const y0 = basePositions[pIdx + 1];

        let dispX = 0;
        let dispY = 0;
        let dispZ = 0;

        // A. Multi-wave superposition from all active propagating liquid ripples
        if (hasRipples) {
          for (let k = 0; k < ripples.length; k++) {
            const rip = ripples[k];
            const dx = x0 - rip.x;
            const dy = y0 - rip.y;

            // Bounding box culling
            const maxReach = rip.radius + rip.width;
            if (Math.abs(dx) > maxReach || Math.abs(dy) > maxReach) {
              continue;
            }

            const dist = Math.hypot(dx, dy);
            const delta = dist - rip.radius;
            const halfW = rip.width * 0.5;

            // Dot lies within expanding wave crest / trough packet
            if (Math.abs(delta) < halfW) {
              const normDelta = delta / halfW; // Range: -1.0 to +1.0

              // Smooth cosine Hann envelope: 1.0 at crest peak, 0.0 at outer boundaries
              const envelope = 0.5 * (1.0 + Math.cos(normDelta * Math.PI));

              // Primary sine wave + subtle secondary harmonic for organic fluid viscosity
              const primaryWave = Math.sin(normDelta * Math.PI * 1.5);
              const secondaryHarmonic = 0.30 * Math.sin(normDelta * Math.PI * 3.0 + 0.35);
              const combinedWave = primaryWave + secondaryHarmonic;

              // Cylindrical wave dispersion decay (energy distributes as radius circle expands)
              const dispersionDecay = 1.0 / Math.sqrt(1.0 + rip.radius / 45.0);

              const zWave = rip.amplitude * combinedWave * envelope * dispersionDecay;

              // Directional normal vector from wave origin to dot
              const invDist = 1.0 / (dist + 0.001);
              const normX = dx * invDist;
              const normY = dy * invDist;

              // Radial particle flow along propagation vector
              const rWave = zWave * 0.42;
              dispX += normX * rWave;
              // Combined vertical displacement: radial tilt + direct vertical wave amplitude
              dispY += normY * rWave - zWave * 0.85;
              dispZ += zWave;
            }
          }
        }

        // B. Immediate fluid push & soft depression directly under cursor
        if (mouseActive) {
          const mdx = x0 - mouse.x;
          const mdy = y0 - mouse.y;
          const mdistSq = mdx * mdx + mdy * mdy;

          if (mdistSq < immRadiusSq) {
            const mdist = Math.sqrt(mdistSq);
            const u = mdist / immRadius; // 0 at cursor, 1 at boundary
            const env = (1.0 - u) * (1.0 - u);

            const invMDist = 1.0 / (mdist + 0.001);
            const push = 11.0 * env;
            dispX += mdx * invMDist * push;
            dispY += mdy * invMDist * push - 6.0 * env;
            dispZ -= 13.0 * env; // Gentle liquid surface depression
          }
        }

        // Target position = base coordinate + accumulated wave displacements
        const targetX = x0 + dispX;
        const targetY = y0 + dispY;
        const targetZ = dispZ;

        // Smooth spring easing towards target
        renderX[i] += (targetX - renderX[i]) * ease;
        renderY[i] += (targetY - renderY[i]) * ease;
        renderZ[i] += (targetZ - renderZ[i]) * ease;

        const curX = renderX[i];
        const curY = renderY[i];
        const curZ = renderZ[i];

        // 4. Premium Visual Effects: Subtle size depth & opacity variation
        let dotRadius = baseRadius;
        let alpha = isDark ? 0.38 : 0.28;

        if (Math.abs(curZ) > 0.08) {
          const zNorm = curZ / CONFIG.baseAmplitude;
          // Wave crests expand slightly (up to 1.5x) and deepen; troughs fade softly
          const zScale = Math.max(0.70, Math.min(1.55, 1.0 + zNorm * 0.48));
          dotRadius = baseRadius * zScale;

          if (isDark) {
            alpha = Math.min(0.92, Math.max(0.18, 0.40 + zNorm * 0.42));
          } else {
            alpha = Math.min(0.85, Math.max(0.14, 0.28 + zNorm * 0.38));
          }
        }

        ctx.beginPath();
        ctx.arc(curX, curY, dotRadius, 0, 6.2831853);

        if (isDark) {
          // Luminous lavender-white in dark mode
          ctx.fillStyle = `rgba(225, 205, 245, ${alpha.toFixed(2)})`;
        } else {
          // Signature PrintForge royal purple in light mode (matching reference image)
          ctx.fillStyle = `rgba(121, 34, 165, ${alpha.toFixed(2)})`;
        }
        ctx.fill();
      }
    }

    resize();

    if (!isTouchDevice && isVisible) {
      animationFrameId = requestAnimationFrame(render);
    }

    return { resize };
  }

  function initAll() {
    // 1. Standalone showcase pages:
    const standaloneCanvas = document.getElementById('waveCanvas') || document.getElementById('dotGridCanvas');
    if (standaloneCanvas) {
      createLiquidWaveInstance(standaloneCanvas, true);
      return;
    }

    // 2. Specific section-level canvases:
    const sectionCanvases = document.querySelectorAll('.pf-section-dot-canvas');
    if (sectionCanvases.length > 0) {
      sectionCanvases.forEach(c => createLiquidWaveInstance(c, false));
    }

    // 3. Global site background canvas:
    let globalCanvas = document.getElementById('pf-interactive-dot-canvas');
    if (!globalCanvas) {
      globalCanvas = document.createElement('canvas');
      globalCanvas.id = 'pf-interactive-dot-canvas';
      document.body.prepend(globalCanvas);
    }
    document.body.classList.add('pf-interactive-dots-active');
    createLiquidWaveInstance(globalCanvas, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
