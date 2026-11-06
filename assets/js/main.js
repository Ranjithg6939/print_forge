/**
 * PrintForge – Main Global Controller (main.js)
 */

(function () {
  'use strict';

  function initAll() {
    initStickyNavbar();
    highlightActiveNav();
    checkNavbarFit();
    initMobileMenu();
    initSearchModal();
    initBackToTop();
    initSmoothScroll();
    initCardBookingCalculator();
    initProductDetailsModal();
    initPricingTabs();
    initBlogPagination();
    initBlogDetailsTopic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Sticky navbar with class toggle
  function initStickyNavbar() {
    const navbarWrap = document.querySelector('.pf-navbar-wrap');
    if (!navbarWrap) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        navbarWrap.classList.add('scrolled');
      } else {
        navbarWrap.classList.remove('scrolled');
      }
    });
  }

  // Highlight active link based on current page file
  function highlightActiveNav() {
    const currentPath = window.location.pathname;
    let pageName = currentPath.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
    if (!pageName || pageName === '') pageName = 'index.html';

    const navLinks = document.querySelectorAll('.pf-nav-link, .pf-dropdown-item');
    // 1. Remove active from ALL navigation links first to prevent dual-highlighting
    navLinks.forEach(link => link.classList.remove('active'));

    // 2. Map subpages to their primary nav item
    let targetFile = pageName;
    if (pageName === 'blog-details.html') targetFile = 'blog.html';
    if (pageName === 'service-details.html') targetFile = 'services.html';

    // 3. Find and highlight ONLY the matching link
    let matchedLink = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const cleanHref = href.split('?')[0].split('#')[0];
        if (cleanHref === targetFile) {
          matchedLink = link;
        }
      }
    });

    // Fallback: If on root or index, match index.html
    if (!matchedLink && (targetFile === 'index.html' || targetFile === '')) {
      matchedLink = document.querySelector('.pf-nav-menu a[href="index.html"]');
    }

    if (matchedLink) {
      matchedLink.classList.add('active');
      // If the matched link is inside a dropdown, also highlight the parent dropdown toggle
      const parentDropdown = matchedLink.closest('.pf-dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.pf-nav-link');
        if (parentToggle) parentToggle.classList.add('active');
      }
    }
  }

  // Responsive Navbar Breakpoint Evaluation
  // Mobile (320px–767px): Hamburger menu
  // Tablet (768px–1024px): Desktop nav if it fits properly without overlapping, otherwise retain hamburger
  // Desktop (1025px+): Full desktop navbar
  function checkNavbarFit() {
    const navbarWrap = document.querySelector('.pf-navbar-wrap');
    if (!navbarWrap) return;

    const w = window.innerWidth;
    if (w < 768) {
      navbarWrap.classList.remove('pf-force-desktop-nav');
      navbarWrap.classList.add('pf-force-mobile-nav');
    } else if (w >= 1025) {
      navbarWrap.classList.remove('pf-force-mobile-nav');
      navbarWrap.classList.add('pf-force-desktop-nav');
    } else {
      // Tablet range (768px–1024px):
      // If width >= 992px, 7 menu items + actions fit cleanly without overlapping.
      // Below 992px (e.g. 768px, 820px), all 7 items exceed the 720px container,
      // so retain hamburger menu to avoid cutting off action buttons.
      if (w >= 992) {
        navbarWrap.classList.remove('pf-force-mobile-nav');
        navbarWrap.classList.add('pf-force-desktop-nav');
      } else {
        navbarWrap.classList.remove('pf-force-desktop-nav');
        navbarWrap.classList.add('pf-force-mobile-nav');
      }
    }
  }

  // Mobile menu open/close & overlay
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.pf-mobile-toggle');
    const navMenu = document.querySelector('.pf-nav-menu');
    
    // Inject mobile overlay if absent
    let overlay = document.querySelector('.pf-nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'pf-nav-overlay';
      document.body.appendChild(overlay);
    }

    const isMobileNavActive = () => {
      if (!toggleBtn) return false;
      return window.getComputedStyle(toggleBtn).display !== 'none';
    };

    function openMenu() {
      if (navMenu) navMenu.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'bi bi-x-lg';
      }
    }

    function closeMenu() {
      if (navMenu) navMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      }
    }

    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (navMenu.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      overlay.addEventListener('click', closeMenu);

      // Close button inside drawer
      const closeBtn = navMenu.querySelector('.pf-mobile-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
      }

      // Allow clicking dropdown toggles on mobile / hamburger mode
      const dropdowns = navMenu.querySelectorAll('.pf-dropdown');
      dropdowns.forEach(dd => {
        const link = dd.querySelector('.pf-nav-link');
        if (link) {
          link.addEventListener('click', function (e) {
            if (isMobileNavActive() && dd.querySelector('.pf-dropdown-menu')) {
              // If already open and user taps the link again, allow direct navigation to href
              if (dd.classList.contains('open') && link.getAttribute('href') && link.getAttribute('href') !== '#') {
                closeMenu();
                return;
              }
              e.preventDefault();
              // Toggle this dropdown and close others
              dropdowns.forEach(other => {
                if (other !== dd) other.classList.remove('open');
              });
              dd.classList.toggle('open');
            }
          });
        }
      });

      // Close mobile menu when a direct navigation link or dropdown item is clicked
      const navLinks = navMenu.querySelectorAll('a.pf-nav-link:not(.pf-dropdown > .pf-nav-link), .pf-dropdown-item, .pf-mobile-action .btn, .pf-btn');
      navLinks.forEach(link => {
        link.addEventListener('click', function () {
          if (isMobileNavActive()) {
            closeMenu();
          }
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
          closeMenu();
        }
      });

      // Window resize handler: check navbar fit & close menu if switched to desktop
      window.addEventListener('resize', function () {
        checkNavbarFit();
        if (!isMobileNavActive() && navMenu.classList.contains('open')) {
          closeMenu();
        }
      });
    }
  }

  // Search Modal
  function initSearchModal() {
    const searchBtns = document.querySelectorAll('.pf-search-btn');
    const searchModal = document.getElementById('pf-search-modal');
    if (!searchModal) return;

    const closeBtn = searchModal.querySelector('.pf-search-close');
    const searchInput = searchModal.querySelector('.pf-search-input');

    searchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('active');
        setTimeout(() => { if (searchInput) searchInput.focus(); }, 150);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => searchModal.classList.remove('active'));
    }

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
      }
    });
  }

  // Back to Top button
  function initBackToTop() {
    let btn = document.querySelector('.pf-back-to-top');
    if (!btn) {
      btn = document.createElement('div');
      btn.className = 'pf-back-to-top';
      btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      btn.title = 'Back to top';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth scroll for anchors
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ===================================================================
  // Interactive Card & Print Booking Calculator Model
  // ===================================================================
  function initCardBookingCalculator() {
    const calcContainer = document.getElementById('card-booking-calculator');
    const modalEl = document.getElementById('pfCardBookingModal');
    
    // If neither exists on current page, return
    if (!calcContainer && !modalEl) return;

    // State
    const state = {
      type: 'visiting-card',
      typeName: 'Visiting Cards (Business Cards)',
      qty: 1000,
      paper: '350-matte',
      paperName: '350 GSM Matte Art Board',
      sides: 'double',
      rush: false,
      addons: ['foil']
    };

    const baseUnitRates = {
      'visiting-card': 0.08,
      'wedding-card': 1.65,
      'brochure': 0.38,
      'book': 2.95,
      'bulk': 0.075
    };

    const paperCosts = {
      '350-matte': 0,
      '350-gloss': 4,
      '400-velvet': 12,
      '450-linen': 18,
      '600-cotton': 32
    };

    const addonRates = {
      'foil': 18,
      'uv': 14,
      'rounded': 8,
      'matte-lam': 10,
      'gilding': 25
    };

    function calculate() {
      const baseRate = baseUnitRates[state.type] || 0.08;
      
      // Volume discount calculation
      let discountPercent = 0;
      if (state.qty >= 25000) discountPercent = 0.55;
      else if (state.qty >= 10000) discountPercent = 0.50;
      else if (state.qty >= 5000) discountPercent = 0.45;
      else if (state.qty >= 2500) discountPercent = 0.35;
      else if (state.qty >= 1000) discountPercent = 0.25;
      else if (state.qty >= 500) discountPercent = 0.15;
      else if (state.qty >= 250) discountPercent = 0.08;

      const rawBaseTotal = state.qty * baseRate;
      const discountAmount = rawBaseTotal * discountPercent;
      const discountedBase = rawBaseTotal - discountAmount;

      // Addons & paper
      let addonTotal = paperCosts[state.paper] || 0;
      state.addons.forEach(a => {
        addonTotal += (addonRates[a] || 0);
      });
      if (state.sides === 'double') addonTotal += 8;
      if (state.rush) addonTotal += 25;

      const grandTotal = Math.max(15, Math.round(discountedBase + addonTotal));
      const perUnit = (grandTotal / state.qty).toFixed(3);

      // Render calculations if calculator on page
      if (calcContainer) {
        const elUnitPrice = calcContainer.querySelector('#calc-unit-price');
        const elBasePrice = calcContainer.querySelector('#calc-base-price');
        const elDiscount = calcContainer.querySelector('#calc-discount');
        const elAddons = calcContainer.querySelector('#calc-addons');
        const elTotal = calcContainer.querySelector('#calc-total');
        const elSummaryType = calcContainer.querySelector('#calc-summary-type');
        const elSummaryQty = calcContainer.querySelector('#calc-summary-qty');
        const elSummaryDelivery = calcContainer.querySelector('#calc-summary-delivery');

        if (elUnitPrice) elUnitPrice.textContent = `$${perUnit} / unit`;
        if (elBasePrice) elBasePrice.textContent = `$${rawBaseTotal.toFixed(2)}`;
        if (elDiscount) {
          if (discountPercent > 0) {
            elDiscount.innerHTML = `<span class="pf-discount-badge">Save ${(discountPercent * 100)}%</span> -$${discountAmount.toFixed(2)}`;
          } else {
            elDiscount.textContent = '$0.00';
          }
        }
        if (elAddons) elAddons.textContent = `+$${addonTotal.toFixed(2)}`;
        if (elTotal) elTotal.textContent = `$${grandTotal}`;
        if (elSummaryType) elSummaryType.textContent = state.typeName;
        if (elSummaryQty) elSummaryQty.textContent = `${state.qty.toLocaleString()} Cards / Units`;

        // Update live preview image in summary
        const elSummaryImg = calcContainer.querySelector('#calc-summary-img');
        const activeChip = calcContainer.querySelector('.pf-type-chip.active');
        if (elSummaryImg && activeChip) {
          const chipImg = activeChip.querySelector('.pf-type-chip-img');
          if (chipImg) {
            elSummaryImg.src = chipImg.src;
            elSummaryImg.alt = state.typeName;
          }
        }

        // Delivery estimate
        if (elSummaryDelivery) {
          const days = state.rush ? 2 : 4;
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() + days);
          const dateStr = targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          elSummaryDelivery.textContent = state.rush ? `Rush Dispatch: ${dateStr}` : `Standard Dispatch: ${dateStr}`;
        }
      }

      // Sync modal pre-fill
      if (modalEl) {
        const modalSummary = modalEl.querySelector('#modal-booking-summary');
        const hiddenSpecs = modalEl.querySelector('#modal-hidden-specs');
        const modalTotal = modalEl.querySelector('#modal-booking-total');
        const modalImg = modalEl.querySelector('#modal-booking-img');
        const summaryText = `${state.qty.toLocaleString()} × ${state.typeName} (${state.paperName}, ${state.sides === 'double' ? 'Double-Sided' : 'Single-Sided'})`;
        
        if (modalSummary) modalSummary.textContent = summaryText;
        if (modalTotal) modalTotal.textContent = `$${grandTotal}`;
        if (hiddenSpecs) hiddenSpecs.value = `${summaryText} | Total: $${grandTotal}`;
        if (modalImg && calcContainer) {
          const activeChip = calcContainer.querySelector('.pf-type-chip.active');
          if (activeChip) {
            const chipImg = activeChip.querySelector('.pf-type-chip-img');
            if (chipImg) modalImg.src = chipImg.src;
          }
        }
      }
    }

    // Bind Type selector chips
    if (calcContainer) {
      const typeChips = calcContainer.querySelectorAll('.pf-type-chip');
      typeChips.forEach(chip => {
        chip.addEventListener('click', function () {
          typeChips.forEach(c => c.classList.remove('active'));
          this.classList.add('active');
          state.type = this.getAttribute('data-type');
          state.typeName = this.querySelector('.pf-type-chip-title') ? this.querySelector('.pf-type-chip-title').textContent : state.type;
          calculate();
        });
      });

      // Bind Quantity chips
      const qtyChips = calcContainer.querySelectorAll('.pf-qty-chip');
      const qtyInput = calcContainer.querySelector('#calc-qty-input');
      const qtySlider = calcContainer.querySelector('#calc-qty-slider');
      const btnMinus = calcContainer.querySelector('#calc-qty-minus');
      const btnPlus = calcContainer.querySelector('#calc-qty-plus');

      function updateQty(newVal) {
        let val = parseInt(newVal, 10);
        if (isNaN(val) || val < 50) val = 50;
        if (val > 25000) val = 25000;
        state.qty = val;

        if (qtyInput) qtyInput.value = val;
        if (qtySlider) qtySlider.value = val;

        qtyChips.forEach(chip => {
          if (parseInt(chip.getAttribute('data-qty'), 10) === val) {
            chip.classList.add('active');
          } else {
            chip.classList.remove('active');
          }
        });

        calculate();
      }

      qtyChips.forEach(chip => {
        chip.addEventListener('click', function () {
          const val = this.getAttribute('data-qty');
          updateQty(val);
        });
      });

      if (qtySlider) {
        qtySlider.addEventListener('input', function () {
          updateQty(this.value);
        });
      }

      if (qtyInput) {
        qtyInput.addEventListener('change', function () {
          updateQty(this.value);
        });
      }

      if (btnMinus) {
        btnMinus.addEventListener('click', function () {
          let step = state.qty <= 500 ? 50 : (state.qty <= 2000 ? 250 : 500);
          updateQty(state.qty - step);
        });
      }

      if (btnPlus) {
        btnPlus.addEventListener('click', function () {
          let step = state.qty < 500 ? 50 : (state.qty < 2000 ? 250 : 500);
          updateQty(state.qty + step);
        });
      }

      // Paper select
      const paperSelect = calcContainer.querySelector('#calc-paper-select');
      if (paperSelect) {
        paperSelect.addEventListener('change', function () {
          state.paper = this.value;
          state.paperName = this.options[this.selectedIndex].text;
          calculate();
        });
      }

      // Sides radio
      const sideRadios = calcContainer.querySelectorAll('input[name="calc_sides"]');
      sideRadios.forEach(radio => {
        radio.addEventListener('change', function () {
          if (this.checked) {
            state.sides = this.value;
            calculate();
          }
        });
      });

      // Finish Checkboxes
      const finishBoxes = calcContainer.querySelectorAll('.pf-calc-addon-check');
      finishBoxes.forEach(box => {
        box.addEventListener('change', function () {
          const val = this.value;
          if (this.checked) {
            if (!state.addons.includes(val)) state.addons.push(val);
          } else {
            state.addons = state.addons.filter(a => a !== val);
          }
          calculate();
        });
      });

      // Rush Checkbox
      const rushBox = calcContainer.querySelector('#calc-rush-check');
      if (rushBox) {
        rushBox.addEventListener('change', function () {
          state.rush = this.checked;
          calculate();
        });
      }

      // Check URL query param for preselected model
      const urlParams = new URLSearchParams(window.location.search);
      const urlType = urlParams.get('type');
      if (urlType) {
        const matchingChip = calcContainer.querySelector(`.pf-type-chip[data-type="${urlType}"]`);
        if (matchingChip) {
          typeChips.forEach(c => c.classList.remove('active'));
          matchingChip.classList.add('active');
          state.type = urlType;
          state.typeName = matchingChip.querySelector('.pf-type-chip-title') ? matchingChip.querySelector('.pf-type-chip-title').textContent : urlType;
        }
      }

      // Initial run
      calculate();
    }

    // Connect Tier Card "Book" buttons to pre-populate modal
    document.querySelectorAll('.pf-pricing-card button[data-bs-target="#pfCardBookingModal"]').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.pf-pricing-card');
        if (!card || !modalEl) return;
        const title = card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : 'Custom Package';
        const price = card.querySelector('.pf-price-val') ? card.querySelector('.pf-price-val').textContent.split('/')[0].trim() : '$0';
        const subtitle = card.querySelector('.pf-price-sub') ? card.querySelector('.pf-price-sub').textContent.trim() : '';
        
        const modalSummary = modalEl.querySelector('#modal-booking-summary');
        const hiddenSpecs = modalEl.querySelector('#modal-hidden-specs');
        const modalTotal = modalEl.querySelector('#modal-booking-total');

        if (modalSummary) modalSummary.textContent = `${title} (${subtitle || 'Commercial Run'})`;
        if (modalTotal) modalTotal.textContent = price;
        if (hiddenSpecs) hiddenSpecs.value = `${title} | Rate: ${price} | ${subtitle}`;
      });
    });

    // Modal Booking Form Submit Handler
    if (modalEl) {
      const bookingForm = modalEl.querySelector('#pf-booking-modal-form');
      const confirmationView = modalEl.querySelector('#pf-booking-confirmation-view');
      const formView = modalEl.querySelector('#pf-booking-form-view');
      const refSlot = modalEl.querySelector('#pf-booking-ref-slot');
      const resetBtn = modalEl.querySelector('#pf-booking-reset-btn');

      if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
          e.preventDefault();
          if (typeof window.pfValidateForm === 'function' && !window.pfValidateForm(bookingForm)) {
            return;
          }

          const submitBtn = this.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Reserving Press Slot...';
          }

          setTimeout(() => {
            const randomRef = 'PF-BK-' + Math.floor(10000 + Math.random() * 90000);
            if (refSlot) refSlot.textContent = randomRef;
            if (formView) formView.style.display = 'none';
            if (confirmationView) confirmationView.style.display = 'block';

            if (typeof window.pfShowToast === 'function') {
              window.pfShowToast(`Order Booking Reserved! Ref: ${randomRef}`, 'success');
            }
          }, 600);
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (formView) formView.style.display = 'block';
          if (confirmationView) confirmationView.style.display = 'none';
          if (bookingForm) {
            bookingForm.reset();
            bookingForm.querySelectorAll('input, select, textarea').forEach(el => {
              el.classList.remove('is-valid', 'is-invalid', 'pf-is-valid', 'pf-is-invalid');
              el.removeAttribute('aria-invalid');
              delete el.dataset.touched;
              const parent = el.closest('.input-group') ? el.closest('.input-group').parentElement : el.parentElement;
              parent?.querySelectorAll('.pf-error-feedback')?.forEach(fb => fb.remove());
            });
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = 'Confirm Booking & Reserve Press Slot <i class="bi bi-arrow-right ms-2"></i>';
            }
          }
        });
      }
    }
  }

  // Product Details Modal Controller (for Pricing & Box Cards)
  function initProductDetailsModal() {
    const modalEl = document.getElementById('pfProductDetailsModal');
    if (!modalEl) return;

    let modalInstance = null;
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      modalInstance = new bootstrap.Modal(modalEl);
    }

    const pdmImg = modalEl.querySelector('#pdm-image');
    const pdmBadge = modalEl.querySelector('#pdm-badge');
    const pdmTitle = modalEl.querySelector('#pdm-title');
    const pdmDesc = modalEl.querySelector('#pdm-desc');
    const pdmPrice = modalEl.querySelector('#pdm-price');
    const pdmUnit = modalEl.querySelector('#pdm-unit');
    const pdmSpecsList = modalEl.querySelector('#pdm-specs-list');
    const pdmBookBtn = modalEl.querySelector('#pdm-book-btn');

    document.querySelectorAll('.pf-details-trigger-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.pf-box-card') || this.closest('.pf-pricing-card');
        if (!card) return;

        const img = card.querySelector('.pf-box-img') || card.querySelector('img');
        const badge = card.querySelector('.badge') || card.querySelector('.pf-pricing-tag') || card.querySelector('.pf-pricing-tag-gold');
        const title = card.querySelector('h4');
        const desc = card.querySelector('.pf-box-desc');
        const price = card.querySelector('.pf-box-price') || card.querySelector('.pf-price-val');
        const unit = card.querySelector('.pf-box-unit-pill') || card.querySelector('.pf-price-sub');
        const features = card.querySelectorAll('.pf-box-features li, .pf-pricing-features li');
        const bookLink = card.querySelector('a.pf-btn');

        if (pdmImg && img) {
          pdmImg.src = img.src;
          pdmImg.alt = title ? title.textContent.trim() : 'Product Sample';
        }
        if (pdmBadge) pdmBadge.textContent = badge ? badge.textContent.trim() : 'Technical Specification';
        if (pdmTitle) pdmTitle.textContent = title ? title.textContent.trim() : 'Product Details';
        if (pdmDesc) pdmDesc.textContent = desc ? desc.textContent.trim() : 'Engineered for exceptional tactile presence and commercial press reliability.';
        if (pdmPrice) pdmPrice.textContent = price ? price.textContent.trim() : '$0';
        if (pdmUnit) pdmUnit.textContent = unit ? unit.textContent.trim() : 'Starting Rate';

        if (pdmSpecsList) {
          if (features && features.length > 0) {
            pdmSpecsList.innerHTML = Array.from(features).map(f => `
              <li class="mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-success flex-shrink-0"></i>
                <span>${f.textContent.trim()}</span>
              </li>
            `).join('');
          } else {
            pdmSpecsList.innerHTML = `
              <li class="mb-2 d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success"></i> <span>Heidelberg Speedmaster XL 106 Press Run</span></li>
              <li class="mb-2 d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success"></i> <span>Closed-Loop ISO 12647-2 Spectrophotometry</span></li>
              <li class="mb-2 d-flex align-items-center gap-2"><i class="bi bi-check-circle-fill text-success"></i> <span>Digital Preflight PDF Proof Included</span></li>
            `;
          }
        }

        if (pdmBookBtn && bookLink) {
          pdmBookBtn.href = bookLink.getAttribute('href') || 'booking.html';
        }

        if (modalInstance) {
          modalInstance.show();
        }
      });
    });
  }

  // Pricing Category Tabs Controller
  function initPricingTabs() {
    const tabs = document.querySelectorAll('.pf-category-tabs .pf-category-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          const target = document.querySelector(href);
          if (target) {
            const offset = target.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // Interactive Blog Controller: Pagination, Categories & Tags Filtering
  function initBlogPagination() {
    const grid = document.getElementById('pf-blog-posts-grid');
    const pagination = document.getElementById('pf-blog-pagination');
    const filterBanner = document.getElementById('pf-filter-banner');
    const paginationNav = document.querySelector('.pf-pagination-nav');
    if (!grid || !pagination) return;

    const allArticles = [
      {
        id: 1,
        page: 1,
        slug: 'smyth-sewn',
        img: 'assets/images/blog/Smyth-Sewn vs. PUR.jpg',
        alt: 'Smyth Sewn vs PUR Binding',
        date: 'Oct 18, 2026',
        tag: 'Bookbinding',
        categories: ['Commercial Offset', 'Book Manufacturing'],
        tags: ['Heidelberg', 'Hardcover', 'SmythSewn', 'Debossing'],
        title: 'Smyth-Sewn vs. PUR Perfect Binding: Which Spine Architecture Should You Specify?',
        desc: 'An engineering comparison between thread-sewn signatures and polyurethane reactive adhesives for longevity.',
        link: 'blog-details.html?article=smyth-sewn'
      },
      {
        id: 2,
        page: 1,
        slug: 'packaging-dielines',
        img: 'assets/images/blog/Designing Flawless Packaging Dielines.jpg',
        alt: 'Custom Dielines for Packaging',
        date: 'Oct 12, 2026',
        tag: 'Packaging',
        categories: ['Packaging Engineering', 'Commercial Offset'],
        tags: ['Fogra51', 'DieCutting', 'OffsetPress'],
        title: 'Designing Flawless Packaging Dielines: Grain Direction, Crease Channels & Bleeds',
        desc: 'Avoid carton cracking along fold lines with correct paperboard grain alignment and steel rule channel calculations.',
        link: 'blog-details.html?article=packaging-dielines'
      },
      {
        id: 3,
        page: 1,
        slug: 'paper-bulking',
        img: "assets/images/blog/The Publisher's Guide to Paper Bulking.jpg",
        alt: 'Paper Caliper and Bulking Guide',
        date: 'Sep 29, 2026',
        tag: 'Paper Science',
        categories: ['Paper & Material Science', 'Book Manufacturing'],
        tags: ['PaperBulking', 'FSCCertified', 'Hardcover'],
        title: 'The Publisher\'s Guide to Paper Bulking: Grammage vs. Caliper Thickness Explained',
        desc: 'Why an 80 GSM high-bulk paper can produce a spine thicker than a 115 GSM coated sheet, saving postage weight.',
        link: 'blog-details.html?article=paper-bulking'
      },
      {
        id: 4,
        page: 1,
        slug: 'foil-dies',
        img: 'assets/images/blog/Magnesium vs. Brass Foil Dies.jpg',
        alt: 'Hot Foil Stamping Dies',
        date: 'Sep 15, 2026',
        tag: 'Embellishments',
        categories: ['Commercial Offset', 'Book Manufacturing'],
        tags: ['GoldFoil', 'Debossing', 'Heidelberg'],
        title: 'Magnesium vs. Brass Foil Dies: Choosing the Right Heat & Pressure for Luxury Finishes',
        desc: 'Discover when to invest in CNC-sculpted brass dies over etched magnesium plates for deep multi-level deboss.',
        link: 'blog-details.html?article=foil-dies'
      },
      {
        id: 5,
        page: 2,
        slug: 'uv-coatings',
        img: "assets/images/blog/UV vs. Water-Based Coatings.jpg",
        alt: 'UV Coatings & Laminations',
        date: 'Aug 28, 2026',
        tag: 'Coatings & Finishes',
        categories: ['Commercial Offset', 'Packaging Engineering'],
        tags: ['OffsetPress', 'Heidelberg', 'Fogra51'],
        title: 'UV vs. Water-Based Coatings: Maximum Gloss & Rub Resistance Compared',
        desc: 'Evaluate gloss depth, scuff resistance, and in-line curing speeds for high-volume commercial offset lithography.',
        link: 'blog-details.html?article=uv-coatings'
      },
      {
        id: 6,
        page: 2,
        slug: 'ink-physics',
        img: "assets/images/services/Offset Printing press.jpg",
        alt: 'Spectrophotometry and Ink Viscosity',
        date: 'Aug 14, 2026',
        tag: 'Prepress & Color',
        categories: ['Prepress & Color Calibration', 'Commercial Offset'],
        tags: ['Fogra51', 'Pantone', 'ColorScience', 'OffsetPress'],
        title: 'The Physics of Ink Tack & Viscosity in High-Speed Lithography',
        desc: 'How ink temperature control and dynamic roller shearing prevent paper picking on heavy multi-color coverage runs.',
        link: 'blog-details.html?article=ink-physics'
      },
      {
        id: 7,
        page: 2,
        slug: 'sustainable-substrates',
        img: "assets/images/blog/Sustainable Substrates FSC-Certified Recycled PCW Kraft in Commercial Runs.jpg",
        alt: 'Sustainable Printing & Recycled Substrates',
        date: 'Jul 30, 2026',
        tag: 'Paper Science',
        categories: ['Paper & Material Science', 'Packaging Engineering'],
        tags: ['FSCCertified', 'PaperBulking', 'DieCutting'],
        title: 'Sustainable Substrates: FSC-Certified Recycled PCW Kraft in Commercial Runs',
        desc: 'Balancing tensile tear strength, ink holdout, and opacity when transitioning to 100% post-consumer waste fibers.',
        link: 'blog-details.html?article=sustainable-substrates'
      },
      {
        id: 8,
        page: 2,
        slug: 'blind-embossing',
        img: "assets/images/blog/Multi-Level Blind Embossing.jpg",
        alt: 'Blind Embossing on Cotton Stock',
        date: 'Jul 12, 2026',
        tag: 'Luxury Identity',
        categories: ['Commercial Offset', 'Book Manufacturing'],
        tags: ['Debossing', 'GoldFoil', 'Hardcover'],
        title: 'Multi-Level Blind Embossing: Micro-Etched Details on Heavy Cotton Stock',
        desc: 'Achieving sculpted haptic tactile feedback without foil discoloration using heated female copper counter-dies.',
        link: 'blog-details.html?article=blind-embossing'
      },
      {
        id: 9,
        page: 3,
        slug: 'case-binding-spine',
        img: "assets/images/blog/Hardcover Case Binding Square Back vs. Round Back Spine Specs.jpg",
        alt: 'Hardcover Smyth-Sewn Case Binding',
        date: 'Jun 25, 2026',
        tag: 'Bookbinding',
        categories: ['Book Manufacturing'],
        tags: ['Hardcover', 'SmythSewn', 'FSCCertified'],
        title: 'Hardcover Case Binding: Square Back vs. Round Back Spine Specs',
        desc: 'Structural engineering principles behind spine crowning, joint flexibility, and mull cloth reinforcement.',
        link: 'blog-details.html?article=case-binding-spine'
      },
      {
        id: 10,
        page: 3,
        slug: 'expanded-gamut',
        img: "assets/images/blog/Expanded Color Gamut  7-Color Litho vs. Pantone Inks.jpg",
        alt: 'Expanded Color Gamut Printing',
        date: 'Jun 10, 2026',
        tag: 'Color Science',
        categories: ['Prepress & Color Calibration', 'Commercial Offset'],
        tags: ['Pantone', 'ColorScience', 'Fogra51'],
        title: 'Expanded Color Gamut (ECG): 7-Color Litho vs. Pantone Inks',
        desc: 'How CMYK+OGV ink sets hit 92% of the Pantone spectrum without wash-ups between packaging press changes.',
        link: 'blog-details.html?article=expanded-gamut'
      },
      {
        id: 11,
        page: 3,
        slug: 'folding-boxboard',
        img: "assets/images/blog/Folding Boxboard Grain Direction & Endurance Fatigue Tests.jpg",
        alt: 'Folding Boxboard Packaging Cartons',
        date: 'May 28, 2026',
        tag: 'Packaging',
        categories: ['Packaging Engineering'],
        tags: ['DieCutting', 'PaperBulking', 'OffsetPress'],
        title: 'Folding Boxboard Grain Direction & Endurance Fatigue Tests',
        desc: 'Preventing hinge fatigue and glue flap delamination in pharmaceutical and retail folding cartons.',
        link: 'blog-details.html?article=folding-boxboard'
      },
      {
        id: 12,
        page: 3,
        slug: 'metallic-inks',
        img: "assets/images/blog/Magnesium vs. Brass Foil Dies Choosing the Right Heat & Pressure for Luxury Finishes.jpg",
        alt: 'Metallic Foil Stamping and Inks',
        date: 'May 15, 2026',
        tag: 'Embellishments',
        categories: ['Commercial Offset', 'Prepress & Color Calibration'],
        tags: ['OffsetPress', 'Pantone', 'GoldFoil', 'Heidelberg'],
        title: 'Metallic & Pearlescent Inks: Formulations & Trapping Specs',
        desc: 'Optimizing leafing aluminum flake orientation and varnish overprint trapping to stop metallic oxidation.',
        link: 'blog-details.html?article=metallic-inks'
      }
    ];

    let currentPage = 1;
    const totalPages = 3;
    let currentFilter = null; // { type: 'category'|'tag', val: '...' }

    function createCardHTML(post) {
      return `
        <div class="col-md-6">
          <div class="pf-blog-card h-100">
            <div class="pf-blog-thumb">
              <a href="${post.link}">
                <img src="${post.img}" alt="${post.alt}">
              </a>
            </div>
            <div class="pf-blog-body">
              <div class="pf-blog-meta">
                <span><i class="bi bi-calendar3 me-1"></i> ${post.date}</span>
                <span><i class="bi bi-tag me-1"></i> ${post.tag}</span>
              </div>
              <h3 class="pf-blog-title">
                <a href="${post.link}">${post.title}</a>
              </h3>
              <p class="small text-secondary mb-3">${post.desc}</p>
              <a href="${post.link}" class="pf-link-arrow mt-auto">Read Guide <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
        </div>
      `;
    }

    function renderPage(page) {
      currentFilter = null;
      currentPage = page;

      // Clear active styles on sidebar
      document.querySelectorAll('.pf-category-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.pf-tag-badge').forEach(el => el.classList.remove('active'));

      // Hide filter banner
      if (filterBanner) {
        filterBanner.classList.add('d-none');
        filterBanner.innerHTML = '';
      }

      // Show pagination
      if (paginationNav) {
        paginationNav.classList.remove('d-none');
      }

      const pageArticles = allArticles.filter(a => a.page === page);

      grid.style.opacity = '0';
      grid.style.transition = 'opacity 0.2s ease';

      setTimeout(() => {
        grid.innerHTML = pageArticles.map(createCardHTML).join('');
        grid.style.opacity = '1';
        updatePaginationUI();
      }, 160);
    }

    function applyFilter(type, val) {
      currentFilter = { type, val };
      const normalizedVal = val.toLowerCase().replace(/^#/, '').trim();

      const matched = allArticles.filter(post => {
        if (type === 'category') {
          return post.categories.some(c => c.toLowerCase() === normalizedVal);
        } else if (type === 'tag') {
          return post.tags.some(t => t.toLowerCase().replace(/^#/, '') === normalizedVal) ||
                 post.tag.toLowerCase().replace(/^#/, '') === normalizedVal;
        }
        return false;
      });

      // Update active states on sidebar
      document.querySelectorAll('.pf-category-item').forEach(el => {
        const itemVal = el.getAttribute('data-filter-val');
        if (type === 'category' && itemVal && itemVal.toLowerCase() === normalizedVal) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      document.querySelectorAll('.pf-tag-badge').forEach(el => {
        const tagVal = el.getAttribute('data-filter-val') || el.textContent.replace(/^#/, '').trim();
        if (type === 'tag' && tagVal && tagVal.toLowerCase() === normalizedVal) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });

      // Show Filter Status Banner
      if (filterBanner) {
        const displayLabel = type === 'tag' ? '#' + val.replace(/^#/, '') : val;
        filterBanner.className = 'pf-filter-bar d-flex align-items-center justify-content-between p-3 mb-4 rounded-3';
        filterBanner.innerHTML = `
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span class="pf-filter-badge"><i class="bi bi-funnel-fill me-1"></i> ${type === 'category' ? 'Category' : 'Tag'}</span>
            <span class="pf-filter-name fw-bold">${displayLabel}</span>
            <span class="text-secondary small">(${matched.length} article${matched.length === 1 ? '' : 's'} found)</span>
          </div>
          <button type="button" class="btn btn-sm pf-btn-clear-filter" id="pf-btn-clear-filter">
            <i class="bi bi-x-circle me-1"></i> View All Articles
          </button>
        `;

        const clearBtn = filterBanner.querySelector('#pf-btn-clear-filter');
        if (clearBtn) {
          clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearFilter();
          });
        }
      }

      // Hide standard pagination while filtering
      if (paginationNav) {
        paginationNav.classList.add('d-none');
      }

      // Animate cards update
      grid.style.opacity = '0';
      grid.style.transition = 'opacity 0.2s ease';

      setTimeout(() => {
        if (matched.length > 0) {
          grid.innerHTML = matched.map(createCardHTML).join('');
        } else {
          grid.innerHTML = `
            <div class="col-12 text-center py-5">
              <div class="pf-sidebar-widget p-5">
                <i class="bi bi-journal-x text-muted" style="font-size: 3rem;"></i>
                <h4 class="mt-3">No Articles Found</h4>
                <p class="text-secondary">We couldn't find any articles matching this filter.</p>
                <button class="pf-btn pf-btn-primary mt-2" id="pf-btn-no-results">View All Articles</button>
              </div>
            </div>
          `;
          const noResultsBtn = grid.querySelector('#pf-btn-no-results');
          if (noResultsBtn) {
            noResultsBtn.addEventListener('click', function(e) {
              e.preventDefault();
              clearFilter();
            });
          }
        }
        grid.style.opacity = '1';
        scrollToGrid();
      }, 160);
    }

    function clearFilter() {
      renderPage(1);
      scrollToGrid();
    }

    function updatePaginationUI() {
      // Prev button
      const prevLi = pagination.querySelector('#pf-page-prev');
      if (prevLi) {
        if (currentPage <= 1) {
          prevLi.classList.add('disabled');
        } else {
          prevLi.classList.remove('disabled');
        }
      }

      // Next button
      const nextLi = pagination.querySelector('#pf-page-next');
      if (nextLi) {
        if (currentPage >= totalPages) {
          nextLi.classList.add('disabled');
        } else {
          nextLi.classList.remove('disabled');
        }
      }

      // Number buttons
      pagination.querySelectorAll('[data-page]').forEach(li => {
        const pageNum = parseInt(li.getAttribute('data-page'), 10);
        if (pageNum === currentPage) {
          li.classList.add('active');
        } else {
          li.classList.remove('active');
        }
      });
    }

    pagination.addEventListener('click', function (e) {
      const target = e.target.closest('a');
      if (!target) return;
      e.preventDefault();

      const pageItem = target.closest('.page-item');
      if (!pageItem || pageItem.classList.contains('disabled')) return;

      if (pageItem.id === 'pf-page-prev') {
        if (currentPage > 1) {
          renderPage(currentPage - 1);
          scrollToGrid();
        }
      } else if (pageItem.id === 'pf-page-next') {
        if (currentPage < totalPages) {
          renderPage(currentPage + 1);
          scrollToGrid();
        }
      } else if (pageItem.hasAttribute('data-page')) {
        const targetPage = parseInt(pageItem.getAttribute('data-page'), 10);
        if (targetPage !== currentPage) {
          renderPage(targetPage);
          scrollToGrid();
        }
      }
    });

    // Allow category row click to navigate directly to the related article link
    document.querySelectorAll('.pf-category-item').forEach(item => {
      item.addEventListener('click', function(e) {
        const link = this.querySelector('a.pf-category-link');
        if (link && e.target !== link && !e.target.closest('a')) {
          window.location.href = link.href;
        }
      });
    });

    function scrollToGrid() {
      const topTarget = document.getElementById('articles-top');
      if (topTarget) {
        const rect = topTarget.getBoundingClientRect();
        const offset = window.pageYOffset + rect.top - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  }

  // Dynamic Article Customization for blog-details.html based on ?article=, ?topic= or ?tag=
  function initBlogDetailsTopic() {
    const titleEl = document.getElementById('pf-article-title');
    const badgeEl = document.getElementById('pf-article-badge');
    if (!titleEl || !badgeEl) return;

    const params = new URLSearchParams(window.location.search);
    const articleSlug = params.get('article');
    const topic = params.get('topic');
    const tag = params.get('tag');

    // Article Content Registry
    const articlesDB = {
      'iso-12647': {
        slug: 'iso-12647',
        badge: 'Color Management & Lithography',
        title: 'Demystifying ISO 12647-2 & Fogra 51: How Closed-Loop Spectrophotometry Prevents Color Drifts',
        author: 'Dr. Evelyn Sterling',
        authorRole: 'Director of Color Science & CTP Systems, PrintForge',
        authorImg: 'assets/images/about/Dr. Evelyn Sterling.jpg',
        authorDesc: 'Dr. Sterling holds a doctorate in imaging science and has spent 19 years optimizing lithographic calibration, RIP screening algorithms, and automated ink-key formulations for global publishers.',
        date: 'October 28, 2026',
        readTime: '8 Min Read',
        views: '3,420 Views',
        img: 'assets/images/blog/Featured Guide.jpg',
        lead: 'Every master press operator knows that an offset printing machine is a living, breathing mechanical entity. Temperature fluctuations in the ink duct rollers, slight changes in fountain solution conductivity, and hygroscopic humidity absorption by the paper web all strive to push color out of registration.',
        toc: [
          'The Physics of Color Drift on Offset Presses',
          'What ISO 12647-2 & Fogra 51 Mandate',
          'How In-Line Spectrophotometry Works at 18,000 SPH',
          'Practical Checklist for Prepress Art Directors'
        ],
        sections: [
          {
            title: '1. The Physics of Color Drift on Offset Presses',
            html: `<p>In traditional lithography, ink transfer relies upon a microscopic chemical balance between hydrophobic oil-based ink and hydrophilic fountain solution. Over an extended 500,000-sheet run, slight rises in ambient temperature cause the ink viscosity to drop, increasing ink film transfer thickness. Without continuous feedback, a brand's corporate red can migrate noticeably toward deep magenta.</p>
            <blockquote class="pf-pull-quote my-4">
              <p class="pf-pull-quote-text">"A human eye can distinguish a Delta E of 1.0 under calibrated D50 daylight lamps. When packaging cartons sit side by side on retail shelves, a variation of Delta E 2.5 is immediately perceptible as a counterfeit or stale product."</p>
              <footer class="pf-pull-quote-author">Dr. Evelyn Sterling, Head of Color Science at PrintForge</footer>
            </blockquote>`
          },
          {
            title: '2. What ISO 12647-2 & Fogra 51 Mandate',
            html: `<p>The ISO 12647-2 standard defines target colorimetric values (CIE L*a*b*) for process inks printed onto standardized substrates. Fogra 51 (characterization data set) modernized these standards to account for modern papers containing Optical Brightening Agents (OBAs), utilizing M1 measurement conditions (D50 illuminant including UV component).</p>`
          },
          {
            title: '3. How In-Line Spectrophotometry Works at 18,000 SPH',
            html: `<p>On our Heidelberg Speedmaster XL 106, the Prinect Inpress Control 3 system utilizes a high-precision spectral sensor mounted directly inside the final printing unit. At maximum running speeds (5 sheets per second):</p>
            <ul>
              <li>The sensor captures spectral reflectance across a micro color control strip positioned in the sheet margin.</li>
              <li>Data is mathematically converted into solid ink density and Delta E deviations within milliseconds.</li>
              <li>Automated motorized ink-zone motors adjust ink fountain keys across all 8 printing towers without stopping the press.</li>
              <li>Waste sheets are automatically routed to a bypass rejection chute before entering the delivery pile.</li>
            </ul>`
          },
          {
            title: '4. Practical Checklist for Prepress Art Directors',
            html: `<p>To ensure your digital files reproduce with 100% fidelity on our automated press lines, adhere to the following preflight standards:</p>
            <ol>
              <li><strong>Convert RGB Imagery to Fogra 51 (PSO Coated v3):</strong> Avoid generic sRGB or US Web Coated SWOP profiles for European/North American commercial paper runs.</li>
              <li><strong>Set Total Ink Coverage (TIC) below 300%:</strong> Excess ink stacking beyond 300% causes smearing and extended drying times.</li>
              <li><strong>Verify Overprint Settings on Rich Black:</strong> Use <code>C: 60, M: 40, Y: 40, K: 100</code> for lush, deep black backgrounds without bronzing.</li>
            </ol>`
          }
        ]
      },
      'smyth-sewn': {
        slug: 'smyth-sewn',
        badge: 'Bookbinding & Structural Architecture',
        title: 'Smyth-Sewn vs. PUR Perfect Binding: Which Spine Architecture Should You Specify?',
        author: 'Marcus Vance',
        authorRole: 'Master Bookbinder & Bindery Engineer, PrintForge',
        authorImg: 'assets/images/about/Rachel Chang.jpg',
        authorDesc: 'Marcus has 24 years of industrial bindery engineering experience, specializing in thread-sewn library archives, lay-flat monographs, and automated adhesive spine tensile analytics.',
        date: 'October 18, 2026',
        readTime: '9 Min Read',
        views: '2,940 Views',
        img: 'assets/images/blog/Smyth-Sewn vs. PUR.jpg',
        lead: 'Choosing between Smyth sewing and polyurethane reactive (PUR) adhesive binding determines whether your publication survives decades of heavy archival consultation or suffers spine delamination under repetitive mechanical stress.',
        toc: [
          'The Mechanical Principles of Smyth Sewing',
          'The Chemistry of PUR Polyurethane Reactive Adhesive',
          'Comparative Tensile Page-Pull Stress Benchmarks',
          'Architectural Decision Matrix for Art Books & Catalogs'
        ],
        sections: [
          {
            title: '1. The Mechanical Principles of Smyth Sewing',
            html: `<p>Smyth sewing binds folded paper signatures together using interlocking high-tensile cotton or polyester thread. Because each signature is sewn individually and chained to its neighbor, the spine retains 100% mechanical flexibility. Readers can open the book completely flat without cracking the spine or losing text inside the gutter margin.</p>
            <blockquote class="pf-pull-quote my-4">
              <p class="pf-pull-quote-text">"A thread-sewn book doesn't rely on chemical adhesion alone. Its strength is derived from tensile geometry, allowing heavy art stocks to flex endlessly without fatigue."</p>
              <footer class="pf-pull-quote-author">Marcus Vance, Master Bookbinder at PrintForge</footer>
            </blockquote>`
          },
          {
            title: '2. The Chemistry of PUR Polyurethane Reactive Adhesive',
            html: `<p>PUR adhesive utilizes atmospheric moisture to initiate a chemical cross-linking polymerization reaction. Unlike conventional hot-melt EVA glue which re-melts under high temperatures, cured PUR is virtually impervious to environmental temperature swings ranging from -40°C to +95°C.</p>`
          },
          {
            title: '3. Comparative Tensile Page-Pull Stress Benchmarks',
            html: `<p>In standardized laboratory page-pull tests measured in Newtons per centimeter (N/cm):</p>
            <ul>
              <li><strong>Standard EVA Hot-Melt:</strong> Averages 5.5 to 7.0 N/cm before fiber pullout.</li>
              <li><strong>PUR Adhesive:</strong> Exceeds 11.5 N/cm, forming a molecular bond directly with coated paper fibers.</li>
              <li><strong>Smyth-Sewn Signatures with PUR Backing:</strong> Surpasses 17.0 N/cm, representing the pinnacle of archival binding strength.</li>
            </ul>`
          },
          {
            title: '4. Architectural Decision Matrix for Art Books & Catalogs',
            html: `<p>When specifying spine architecture for your upcoming print run, follow these production rules:</p>
            <ol>
              <li><strong>Specify Smyth Sewing for books over 150 GSM:</strong> Heavy coated papers crack under stiff EVA adhesives; thread signatures ensure lay-flat comfort.</li>
              <li><strong>Choose PUR for high-frequency softcovers:</strong> Product catalogs, medical manuals, and corporate reports benefit from PUR's flexible chemical hold.</li>
              <li><strong>Account for 10mm Gutter Margins:</strong> Regardless of binding style, keep running headers and body margins clear of the inner bind fold.</li>
            </ol>`
          }
        ]
      },
      'packaging-dielines': {
        slug: 'packaging-dielines',
        badge: 'Packaging Engineering & Die-Cutting',
        title: 'Designing Flawless Packaging Dielines: Grain Direction, Crease Channels & Bleeds',
        author: 'Helena Rostov',
        authorRole: 'Senior Packaging Engineer, PrintForge',
        authorImg: 'assets/images/about/Elena Rostova.jpg',
        authorDesc: 'Helena leads dieline prototyping, structural CAD calculations, and auto-gluer testing for pharmaceutical and luxury retail packaging clients worldwide.',
        date: 'October 12, 2026',
        readTime: '7 Min Read',
        views: '4,110 Views',
        img: 'assets/images/blog/Designing Flawless Packaging Dielines.jpg',
        lead: 'In high-speed automated carton erecting lines running at 600 cartons per minute, a 0.2mm miscalculation in score channel depth or grain orientation causes catastrophic carton jamming and white fiber cracking along the fold.',
        toc: [
          'Paperboard Grain Direction and Tear Resistance',
          'Creasing Matrix Depth vs. Steel Rule Sizing',
          'Bleed Geometry for Automated Folding & Gluing',
          'Prepress Dieline Checklist for CAD Designers'
        ],
        sections: [
          {
            title: '1. Paperboard Grain Direction and Tear Resistance',
            html: `<p>Paperboard fibers naturally align in the direction of the paper mill's moving wire (the grain direction). Folding parallel to the grain produces a clean, low-resistance bend with minimal cracking. Folding across the grain requires deliberate creasing channel calibration to compress fiber bundles without snapping them.</p>
            <blockquote class="pf-pull-quote my-4">
              <p class="pf-pull-quote-text">"Correct score channel calculation is the difference between a pristine luxury package and an unsightly white cracked edge on your primary display panel."</p>
              <footer class="pf-pull-quote-author">Helena Rostov, Packaging Engineer at PrintForge</footer>
            </blockquote>`
          },
          {
            title: '2. Creasing Matrix Depth vs. Steel Rule Sizing',
            html: `<p>A precision steel rule die utilizes a creasing rule paired with a counter-matrix. The matrix width must equal <code>(Paperboard Caliper × 1.5) + Rule Thickness</code>. Deviating from this formula results in either an under-creased hinge that springs open or crushed board that tears upon folding.</p>`
          },
          {
            title: '3. Bleed Geometry for Automated Folding & Gluing',
            html: `<p>High-speed folder-gluers require specific clearance allowances:</p>
            <ul>
              <li>Glue flaps must be free of UV coatings, varnish, and laminate to permit hot-melt or cold-glue fiber fusion.</li>
              <li>Extend external bleed by at least 3.0mm (1/8") past cut lines.</li>
              <li>Retract artwork 1.5mm back from fold lines adjacent to white interior flaps to prevent color flashing.</li>
            </ul>`
          },
          {
            title: '4. Prepress Dieline Checklist for CAD Designers',
            html: `<p>Before handing off your dieline to prepress, verify the following parameters:</p>
            <ol>
              <li><strong>Designate Cuts as 100% Spot Red and Creases as 100% Spot Green:</strong> Ensure these rules are set to <code>Overprint Stroke</code> in your vector files.</li>
              <li><strong>Verify Boxboard Caliper:</strong> Confirm whether the substrate is 16pt, 18pt, or 24pt SBS (Solid Bleached Sulfate).</li>
              <li><strong>Check Dust Flap Angles:</strong> Use an 8-degree taper on dust flaps to eliminate collision inside automated filling machines.</li>
            </ol>`
          }
        ]
      },
      'paper-bulking': {
        slug: 'paper-bulking',
        badge: 'Paper Science & Caliper Engineering',
        title: "The Publisher's Guide to Paper Bulking: Grammage vs. Caliper Thickness Explained",
        author: 'Julian Thorne',
        authorRole: 'Material Scientist & Paper Technologist, PrintForge',
        authorImg: 'assets/images/about/Arthur Vance.jpg',
        authorDesc: 'Julian holds a masters in paper chemistry and consults major publishing houses on substrate bulking coefficients, postal weight optimization, and opacity metrics.',
        date: 'September 29, 2026',
        readTime: '6 Min Read',
        views: '3,880 Views',
        img: "assets/images/blog/The Publisher's Guide to Paper Bulking.jpg",
        lead: 'High-bulk paper substrates empower publishers to engineer substantial, authoritative book spines while reducing basis weight, saving up to 28% in global postal freight costs.',
        toc: [
          'Understanding the Bulk Factor: Caliper divided by Grammage',
          'Surface Smoothness vs. Ink Holdout on Bulky Stocks',
          'Spine Width Calculations for Case & Softcover Bindings',
          'Substrate Selection Guide: Coated vs. High-Bulk Woodfree'
        ],
        sections: [
          {
            title: '1. Understanding the Bulk Factor: Caliper divided by Grammage',
            html: `<p>Paper bulk is expressed mathematically as <code>Caliper (in microns) ÷ Grammage (in g/m²)</code>. A standard coated art paper has a bulk factor of 0.8 to 0.9, while an engineered high-bulk uncoated book sheet can reach a bulk factor of 1.8 to 2.2. This means an 80 GSM sheet can produce a spine twice as thick as an equivalent coated stock.</p>
            <blockquote class="pf-pull-quote my-4">
              <p class="pf-pull-quote-text">"Bulk allows a 200-page book to feel as commanding on a retail shelf as a 400-page volume, without demanding extra tonnage in paper pulp."</p>
              <footer class="pf-pull-quote-author">Julian Thorne, Paper Technologist at PrintForge</footer>
            </blockquote>`
          },
          {
            title: '2. Surface Smoothness vs. Ink Holdout on Bulky Stocks',
            html: `<p>High-bulk papers contain more micro-voids between cellulose fibers. While this yields extraordinary lightness and opacity, it requires careful ink-viscosity calibration. On our Heidelberg presses, we utilize specialized low-tack inks to avoid surface fiber picking.</p>`
          },
          {
            title: '3. Spine Width Calculations for Case & Softcover Bindings',
            html: `<p>To calculate exact spine thickness for your cover mechanicals:</p>
            <ul>
              <li><strong>Spine (mm) =</strong> <code>(Page Count ÷ 2) × Page Thickness in mm</code>.</li>
              <li>For hardcovers, add 2 × board thickness (typically 2.5mm per binder's board) plus 1.0mm hinge allowance.</li>
              <li>Never finalize cover art before measuring physical pressroom bulking proofs.</li>
            </ul>`
          },
          {
            title: '4. Substrate Selection Guide: Coated vs. High-Bulk Woodfree',
            html: `<p>Follow these substrate specifications based on project typography and imagery:</p>
            <ol>
              <li><strong>Novels & Memoirs:</strong> 70-80 GSM High-Bulk Cream (Bulk 1.8 - 2.0) for comfortable, glare-free readability.</li>
              <li><strong>Monographs & Photography:</strong> 135-170 GSM Coated Silk (Bulk 0.9) for photographic ink holdout and crisp dot reproduction.</li>
              <li><strong>Corporate Annual Reports:</strong> 115-135 GSM FSC-Certified Premium Uncoated (Bulk 1.3) for modern tactile luxury.</li>
            </ol>`
          }
        ]
      },
      'foil-dies': {
        slug: 'foil-dies',
        badge: 'Embellishments & Foil Stamping',
        title: 'Magnesium vs. Brass Foil Dies: Choosing the Right Heat & Pressure for Luxury Finishes',
        author: 'Elena Rossi',
        authorRole: 'Master Finisher & Tooling Specialist, PrintForge',
        authorImg: 'assets/images/about/Mateo Ross.jpg',
        authorDesc: 'Elena has 16 years of experience sculpting multi-level hot stamping brass dies, holographic registered foils, and micro-etched counter-plates for luxury brands.',
        date: 'September 15, 2026',
        readTime: '8 Min Read',
        views: '3,120 Views',
        img: 'assets/images/blog/Magnesium vs. Brass Foil Dies.jpg',
        lead: 'For luxury packaging and collector edition book covers, selecting between photo-chemically etched magnesium dies and CNC-sculpted 3D brass dies dictates edge sharpness, thermal retention, and microscopic registration durability.',
        toc: [
          'Thermal Conductivity: Magnesium vs. Brass Alloys',
          'Depth and Bevel Precision on Textured Papers',
          'Single-Pass Foil Debossing with Sculpted Counter-Dies',
          'Production Run Thresholds: When to Invest in Brass'
        ],
        sections: [
          {
            title: '1. Thermal Conductivity: Magnesium vs. Brass Alloys',
            html: `<p>Hot foil stamping transfers pigment or metallic layers from a polyester carrier film through controlled thermal activation and tonnage pressure. Magnesium heats up rapidly but loses temperature quickly across large dies. Brass has a much higher thermal mass, maintaining uniform temperature within ±1°C across an entire 28" platen.</p>
            <blockquote class="pf-pull-quote my-4">
              <p class="pf-pull-quote-text">"Brass dies allow us to CNC-carve multi-level relief details with draft angles down to 15 degrees, achieving crisp foil lines as thin as 0.25pt."</p>
              <footer class="pf-pull-quote-author">Elena Rossi, Tooling Specialist at PrintForge</footer>
            </blockquote>`
          },
          {
            title: '2. Depth and Bevel Precision on Textured Papers',
            html: `<p>On heavy linen or rough cotton papers, etched magnesium dies often produce ragged, stamped foil edges due to chemical undercut. CNC-sculpted brass dies feature razor-sharp milled shoulders that shear the foil cleanly into deep paper valleys without orange-peel haloing.</p>`
          },
          {
            title: '3. Single-Pass Foil Debossing with Sculpted Counter-Dies',
            html: `<p>Combining foil stamping and embossing into a single production pass requires paired male/female tooling:</p>
            <ul>
              <li><strong>Heated Female Brass Die:</strong> Carved from solid brass stock with custom tactile textures.</li>
              <li><strong>Epoxy Male Counter-Force:</strong> Poured or milled to match the exact gauge of the specified substrate.</li>
              <li><strong>Register Accuracy:</strong> Eliminates the register shifts inherent in two separate machine passes.</li>
            </ul>`
          },
          {
            title: '4. Production Run Thresholds: When to Invest in Brass',
            html: `<p>Choose tooling based on run quantities and visual intricacy:</p>
            <ol>
              <li><strong>Short Runs under 5,000 units with 2D graphics:</strong> Chemically etched 1/4" Magnesium offers rapid turnaround and lower tooling costs.</li>
              <li><strong>Long Runs over 10,000 units or Multi-Level Sculpting:</strong> Invest in CNC Brass; the die withstands over 500,000 impressions without edge degradation.</li>
              <li><strong>Micro-Etched Refraction Security Foils:</strong> Brass is strictly required to hold sub-millimeter holographic diffraction patterns.</li>
            </ol>`
          }
        ]
      },
      'uv-coatings': {
        slug: 'uv-coatings',
        badge: 'Coatings & Finishes',
        title: 'UV vs. Water-Based Coatings: Maximum Gloss & Rub Resistance Compared',
        author: 'Dr. Evelyn Sterling',
        authorRole: 'Director of Color Science & CTP Systems, PrintForge',
        authorImg: 'assets/images/about/Dr. Evelyn Sterling.jpg',
        authorDesc: 'Dr. Sterling has pioneered in-line spectral gloss monitoring and LED-UV polymer cross-linking protocols for commercial print runs.',
        date: 'August 28, 2026',
        readTime: '7 Min Read',
        views: '2,810 Views',
        img: "assets/images/blog/UV vs. Water-Based Coatings.jpg",
        lead: 'Selecting between ultraviolet (UV) curable lacquers and aqueous water-based dispersions dictates surface optical clarity, scuff resistance, and drying throughput on industrial Heidelberg press lines.',
        toc: [
          'Photopolymerization vs. Evaporative Drying Physics',
          'Sutherland Rub Resistance Benchmarks',
          'Recyclability and De-inking in Post-Consumer Waste',
          'Application Matrix: Packaging vs. Publication Cores'
        ],
        sections: [
          {
            title: '1. Photopolymerization vs. Evaporative Drying Physics',
            html: `<p>UV coatings cure instantaneously via free-radical polymerization under ultraviolet radiation, providing 100% solid state film with mirror-like specular reflection up to 95 GU (Gloss Units).</p>`
          },
          {
            title: '2. Sutherland Rub Resistance Benchmarks',
            html: `<p>In abrasive shipping conditions, UV varnishes withstand 1,000+ rub cycles under 4lb weights without coating scuffing, making them ideal for high-contact retail packaging.</p>`
          }
        ]
      },
      'ink-physics': {
        slug: 'ink-physics',
        badge: 'Prepress & Color Calibration',
        title: 'The Physics of Ink Tack & Viscosity in High-Speed Lithography',
        author: 'Julian Thorne',
        authorRole: 'Material Scientist & Paper Technologist, PrintForge',
        authorImg: 'assets/images/about/Arthur Vance.jpg',
        authorDesc: 'Julian specializes in fluid mechanics, roller shear gradients, and pressroom temperature stabilization.',
        date: 'August 14, 2026',
        readTime: '8 Min Read',
        views: '3,190 Views',
        img: "assets/images/services/Offset Printing press.jpg",
        lead: 'How ink temperature control and dynamic roller shearing prevent paper picking on heavy multi-color coverage runs at 18,000 sheets per hour.',
        toc: [
          'Inkometer Tack Value Dynamics',
          'Shear-Thinning Thixotropy in Lithographic Inks',
          'Fountain Solution Emulsification Control',
          'Preventing Surface Delamination on Heavy Cover Stocks'
        ],
        sections: [
          {
            title: '1. Inkometer Tack Value Dynamics',
            html: `<p>Tack dictates the force required to split an ink film between rotating rollers. Controlled tack sequencing (Black > Cyan > Magenta > Yellow) ensures clean ink transfer without wet-on-wet back-trapping.</p>`
          }
        ]
      },
      'sustainable-substrates': {
        slug: 'sustainable-substrates',
        badge: 'Paper Science & Sustainability',
        title: 'Sustainable Substrates: FSC-Certified Recycled PCW Kraft in Commercial Runs',
        author: 'Helena Rostov',
        authorRole: 'Senior Packaging Engineer, PrintForge',
        authorImg: 'assets/images/about/Elena Rostova.jpg',
        authorDesc: 'Helena leads sustainable substrate testing and circular lifecycle carbon analytics for global packaging clients.',
        date: 'July 30, 2026',
        readTime: '6 Min Read',
        views: '2,640 Views',
        img: "assets/images/blog/Sustainable Substrates FSC-Certified Recycled PCW Kraft in Commercial Runs.jpg",
        lead: 'Balancing tensile tear strength, ink holdout, and opacity when transitioning high-volume brand collateral to 100% post-consumer waste fibers.',
        toc: [
          'Fiber Length Degradation across Recycling Cycles',
          'Achieving Clean Delta E Matching on Brown Kraft Stocks',
          'FSC Chain-of-Custody Certification Standards',
          'Life Cycle Carbon Offset Comparison'
        ],
        sections: [
          {
            title: '1. Fiber Length Degradation across Recycling Cycles',
            html: `<p>Recycled pulp fibers shorten with each processing cycle. We compensate through specialized fiber sizing and starch matrices that deliver virgin-grade fold crack resistance.</p>`
          }
        ]
      },
      'blind-embossing': {
        slug: 'blind-embossing',
        badge: 'Luxury Embellishments',
        title: 'Multi-Level Blind Embossing: Micro-Etched Details on Heavy Cotton Stock',
        author: 'Elena Rossi',
        authorRole: 'Master Finisher & Tooling Specialist, PrintForge',
        authorImg: 'assets/images/about/Mateo Ross.jpg',
        authorDesc: 'Elena has sculpted custom tactile dies for luxury brands, high-end invitations, and corporate heritage books.',
        date: 'July 12, 2026',
        readTime: '7 Min Read',
        views: '3,470 Views',
        img: "assets/images/blog/Multi-Level Blind Embossing.jpg",
        lead: 'Achieving sculpted haptic tactile feedback without foil discoloration using heated female copper counter-dies on 600 GSM double-thick cotton boards.',
        toc: [
          'Substrate Compression Metrics in Cotton Papers',
          'Sculpted 3D Multi-Level Brass Counter-Dies',
          'Temperature Control to Avoid Substrate Scorching',
          'Lighting Angle Perception for Retail Presentation'
        ],
        sections: [
          {
            title: '1. Substrate Compression Metrics in Cotton Papers',
            html: `<p>Long-staple cotton fibers deform elastically under mechanical pressure, allowing reliefs up to 1.5mm without tearing surface paper sheets.</p>`
          }
        ]
      },
      'case-binding-spine': {
        slug: 'case-binding-spine',
        badge: 'Book Manufacturing',
        title: 'Hardcover Case Binding: Square Back vs. Round Back Spine Specs',
        author: 'Marcus Vance',
        authorRole: 'Master Bookbinder & Bindery Engineer, PrintForge',
        authorImg: 'assets/images/about/Rachel Chang.jpg',
        authorDesc: 'Marcus has engineered structural bindings for over 500 hardcover editions and fine-art monographs.',
        date: 'June 25, 2026',
        readTime: '9 Min Read',
        views: '3,890 Views',
        img: "assets/images/blog/Hardcover Case Binding Square Back vs. Round Back Spine Specs.jpg",
        lead: 'Structural engineering principles behind spine crowning, joint flexibility, headband alignment, and mull cloth reinforcement.',
        toc: [
          'Mechanical Arch Physics of Round Back Spines',
          'Square Back Board Tolerances and Crease Hinging',
          'Crash & Mull Reinforcement Cloth Specifications',
          'Selecting Ribbon Markers and Endpaper Grammages'
        ],
        sections: [
          {
            title: '1. Mechanical Arch Physics of Round Back Spines',
            html: `<p>A round back book utilizes the natural compressive strength of an arch, distributing gravitational page-block sag evenly away from the center joint.</p>`
          }
        ]
      },
      'expanded-gamut': {
        slug: 'expanded-gamut',
        badge: 'Prepress & Color Calibration',
        title: 'Expanded Color Gamut (ECG): 7-Color Litho vs. Pantone Inks',
        author: 'Dr. Evelyn Sterling',
        authorRole: 'Director of Color Science & CTP Systems, PrintForge',
        authorImg: 'assets/images/about/Dr. Evelyn Sterling.jpg',
        authorDesc: 'Dr. Sterling specializes in color gamut expansion, spectral curve simulation, and high-fidelity G7 pressroom calibration.',
        date: 'June 10, 2026',
        readTime: '10 Min Read',
        views: '4,220 Views',
        img: "assets/images/blog/Expanded Color Gamut  7-Color Litho vs. Pantone Inks.jpg",
        lead: 'How CMYK+OGV (Orange, Green, Violet) ink sets hit 92% of the Pantone Solid Coated library without ink-fountain wash-ups between packaging jobs.',
        toc: [
          'Spectral Gamut Comparison: CMYK vs. CMYK+OGV vs. Spot Inks',
          'Screen Angle Optimization to Eliminate Moiré Patterns',
          'Cost and Make-Ready Time Reduction in Packaging Runs',
          'Preflight Separation Workflows in Adobe Illustrator & Esko'
        ],
        sections: [
          {
            title: '1. Spectral Gamut Comparison',
            html: `<p>Standard four-color process covers roughly 58% of the Pantone spectrum. Adding pure Orange, Green, and Violet pigments extends the color volume into saturated packaging hues.</p>`
          }
        ]
      },
      'folding-boxboard': {
        slug: 'folding-boxboard',
        badge: 'Packaging Engineering',
        title: 'Folding Boxboard Grain Direction & Endurance Fatigue Tests',
        author: 'Helena Rostov',
        authorRole: 'Senior Packaging Engineer, PrintForge',
        authorImg: 'assets/images/about/Elena Rostova.jpg',
        authorDesc: 'Helena conducts robotic hinge endurance testing and drop-impact simulations for medical and luxury retail folding boxes.',
        date: 'May 28, 2026',
        readTime: '8 Min Read',
        views: '2,510 Views',
        img: "assets/images/blog/Folding Boxboard Grain Direction & Endurance Fatigue Tests.jpg",
        lead: 'Preventing hinge fatigue and glue flap delamination in pharmaceutical cartons through MIT fold endurance testing and grain direction alignment.',
        toc: [
          'MIT Fold Endurance Testing Standards',
          'SBS vs. FBB Multi-Ply Ply-Bond Strength',
          'Hot-Melt Adhesive Open Time & Substrate Penetration',
          'High-Speed Gluer Troubleshooting Guide'
        ],
        sections: [
          {
            title: '1. MIT Fold Endurance Testing Standards',
            html: `<p>Automated folding cartons must withstand a minimum of 250 double-folds at 135 degrees without liner delamination or corner bursting.</p>`
          }
        ]
      },
      'metallic-inks': {
        slug: 'metallic-inks',
        badge: 'Embellishments & Chemistry',
        title: 'Metallic & Pearlescent Inks: Formulations & Trapping Specs',
        author: 'Elena Rossi',
        authorRole: 'Master Finisher & Tooling Specialist, PrintForge',
        authorImg: 'assets/images/about/Mateo Ross.jpg',
        authorDesc: 'Elena formulates custom metallic varnishes, mica pearl pigments, and leafing aluminum emulsions.',
        date: 'May 15, 2026',
        readTime: '7 Min Read',
        views: '3,050 Views',
        img: "assets/images/blog/Magnesium vs. Brass Foil Dies Choosing the Right Heat & Pressure for Luxury Finishes.jpg",
        lead: 'Optimizing leafing aluminum flake orientation and varnish overprint trapping to stop metallic oxidation and achieve brilliant silver and gold luster.',
        toc: [
          'Leafing vs. Non-Leafing Metal Pigment Physics',
          'Tack and Trapping Order on 8-Color Sheetfed Presses',
          'Aqueous Primer Sealing to Prevent Bronze Greening',
          'Dry-Back Optical Measurement Protocols'
        ],
        sections: [
          {
            title: '1. Leafing vs. Non-Leafing Metal Pigment Physics',
            html: `<p>Leafing flakes float to the surface of the ink film forming an overlapping metallic mirror, whereas non-leafing flakes distribute throughout the resin for superior rub resistance.</p>`
          }
        ]
      }
    };

    // ID to Slug resolver
    const idMap = {
      '1': 'smyth-sewn',
      '2': 'packaging-dielines',
      '3': 'paper-bulking',
      '4': 'foil-dies',
      '5': 'uv-coatings',
      '6': 'ink-physics',
      '7': 'sustainable-substrates',
      '8': 'blind-embossing',
      '9': 'case-binding-spine',
      '10': 'expanded-gamut',
      '11': 'folding-boxboard',
      '12': 'metallic-inks'
    };

    let resolvedSlug = articleSlug;
    if (resolvedSlug && idMap[resolvedSlug]) {
      resolvedSlug = idMap[resolvedSlug];
    }

    // Mapping topics & tags to target articles
    const topicToArticle = {
      'Commercial-Offset': 'iso-12647',
      'Book-Manufacturing': 'smyth-sewn',
      'Packaging-Engineering': 'packaging-dielines',
      'Paper-Science': 'paper-bulking',
      'Prepress-Color': 'iso-12647'
    };

    const tagToArticle = {
      'Heidelberg': 'iso-12647',
      'Fogra51': 'iso-12647',
      'Pantone': 'iso-12647',
      'ColorScience': 'iso-12647',
      'OffsetPress': 'iso-12647',
      'Hardcover': 'smyth-sewn',
      'SmythSewn': 'smyth-sewn',
      'DieCutting': 'packaging-dielines',
      'Packaging': 'packaging-dielines',
      'PaperBulking': 'paper-bulking',
      'FSCCertified': 'paper-bulking',
      'GoldFoil': 'foil-dies',
      'Debossing': 'foil-dies'
    };

    let targetKey = 'iso-12647';
    if (resolvedSlug && articlesDB[resolvedSlug]) {
      targetKey = resolvedSlug;
    } else if (topic && topicToArticle[topic]) {
      targetKey = topicToArticle[topic];
    } else if (tag && tagToArticle[tag]) {
      targetKey = tagToArticle[tag];
    }

    const article = articlesDB[targetKey] || articlesDB['iso-12647'];

    // 1. Update Hero Details
    badgeEl.textContent = article.badge;
    titleEl.textContent = article.title;
    document.title = `${article.title} | PrintForge`;

    const metaDate = document.getElementById('pf-article-meta-date');
    if (metaDate && article.date) metaDate.textContent = article.date;

    const metaTime = document.getElementById('pf-article-meta-time');
    if (metaTime && article.readTime) metaTime.textContent = article.readTime;

    const metaViews = document.getElementById('pf-article-meta-views');
    if (metaViews && article.views) metaViews.textContent = article.views;

    const authorName = document.getElementById('pf-article-author-name');
    if (authorName && article.author) authorName.textContent = `By ${article.author}`;

    const authorImg = document.getElementById('pf-article-author-img');
    if (authorImg && article.authorImg) {
      authorImg.src = article.authorImg;
      authorImg.alt = article.author;
      authorImg.onerror = function () {
        this.onerror = null;
        this.src = 'assets/images/3D gallery/Elena Rostova.jpg';
      };
    }

    // 2. Update Featured Hero Image
    const heroImg = document.getElementById('pf-article-hero-img');
    if (heroImg && article.img) {
      heroImg.src = article.img;
      heroImg.alt = article.title;
    }

    // 3. Update Table of Contents (Reading panel & Sidebar)
    const tocList = document.getElementById('pf-article-toc-list');
    const sidebarTocList = document.getElementById('pf-sidebar-toc-list');
    if (article.toc && article.toc.length > 0) {
      if (tocList) {
        tocList.innerHTML = article.toc.map((item, idx) => 
          `<li><a href="#section-${idx + 1}" class="text-decoration-none">${item}</a></li>`
        ).join('');
      }
      if (sidebarTocList) {
        sidebarTocList.innerHTML = article.toc.map((item, idx) => 
          `<li class="mb-2"><a href="#section-${idx + 1}" class="text-secondary"><i class="bi bi-chevron-right me-1"></i> ${item}</a></li>`
        ).join('');
      }
    }

    // 4. Update Article Body Content
    const contentBody = document.getElementById('pf-article-content-body');
    if (contentBody && article.sections && article.sections.length > 0) {
      let bodyHTML = `<p id="section-1" class="lead text-dark fw-medium">${article.lead}</p>`;
      article.sections.forEach((sec, idx) => {
        bodyHTML += `
          <h3 id="section-${idx + 1}" class="h4 fw-bold mt-5 mb-3">${sec.title}</h3>
          ${sec.html}
        `;
      });
      contentBody.innerHTML = bodyHTML;
    }

    // 5. Update Author Bio Box
    const bioName = document.getElementById('pf-author-bio-name');
    if (bioName && article.author) bioName.textContent = `About ${article.author}`;

    const bioRole = document.getElementById('pf-author-bio-role');
    if (bioRole && article.authorRole) bioRole.textContent = article.authorRole;

    const bioDesc = document.getElementById('pf-author-bio-desc');
    if (bioDesc && article.authorDesc) bioDesc.textContent = article.authorDesc;

    const bioImg = document.getElementById('pf-author-bio-img');
    if (bioImg && article.authorImg) {
      bioImg.src = article.authorImg;
      bioImg.alt = article.author;
      bioImg.onerror = function () {
        this.onerror = null;
        this.src = 'assets/images/3D gallery/Elena Rostova.jpg';
      };
    }

    // 6. Update Related Articles (2 matching cards)
    const relatedGrid = document.getElementById('pf-related-articles-grid');
    if (relatedGrid && typeof allArticles !== 'undefined') {
      const candidates = allArticles.filter(a => a.slug !== targetKey);
      const related = candidates.slice(0, 2);
      if (related.length >= 2) {
        relatedGrid.innerHTML = related.map(rel => `
          <div class="col-md-6">
            <div class="pf-blog-card h-100">
              <div class="pf-blog-thumb" style="height: 190px;">
                <a href="${rel.link}">
                  <img src="${rel.img}" alt="${rel.alt || rel.title}" loading="lazy">
                </a>
              </div>
              <div class="pf-blog-body">
                <div class="pf-blog-meta mb-2" style="font-size: 0.78rem;">
                  <span><i class="bi bi-calendar3 me-1"></i> ${rel.date}</span>
                  <span><i class="bi bi-tag me-1"></i> ${rel.tag}</span>
                </div>
                <h5 class="h6 fw-bold mb-2"><a href="${rel.link}" class="text-reset text-decoration-none">${rel.title}</a></h5>
                <p class="small text-secondary mb-3">${rel.desc}</p>
                <a href="${rel.link}" class="pf-link-arrow mt-auto">Read Guide <i class="bi bi-arrow-right"></i></a>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // 7. Highlight Active Category / Tag in the Sidebar
    if (topic) {
      document.querySelectorAll('.pf-category-item').forEach(el => {
        if (el.getAttribute('data-topic') === topic) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    } else {
      document.querySelectorAll('.pf-category-item').forEach(el => el.classList.remove('active'));
    }

    if (tag) {
      document.querySelectorAll('.pf-tag-badge').forEach(el => {
        if (el.href.includes(`tag=${tag}`)) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    } else {
      document.querySelectorAll('.pf-tag-badge').forEach(el => el.classList.remove('active'));
    }
  }
})();
