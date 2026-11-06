/**
 * PrintForge – Portfolio & Lightbox Controller (portfolio.js)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initPortfolioFiltering();
    initLightbox();
  });

  // Filter items by category
  function initPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.pf-filter-btn');
    const galleryItems = document.querySelectorAll('.pf-gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCat === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // Lightbox Preview
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.pf-gallery-item');
    if (!galleryItems.length) return;

    // Create lightbox DOM elements if not already present
    let lightbox = document.getElementById('pf-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'pf-lightbox';
      lightbox.className = 'pf-lightbox';
      lightbox.innerHTML = `
        <button class="pf-lightbox-close" aria-label="Close Lightbox">&times;</button>
        <button class="pf-lightbox-nav pf-lightbox-prev" aria-label="Previous Image"><i class="bi bi-chevron-left"></i></button>
        <button class="pf-lightbox-nav pf-lightbox-next" aria-label="Next Image"><i class="bi bi-chevron-right"></i></button>
        <div class="pf-lightbox-content">
          <img src="" alt="Printing Sample" class="pf-lightbox-img" id="pf-lightbox-image">
          <div class="pf-lightbox-caption" id="pf-lightbox-title"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('pf-lightbox-image');
    const lightboxTitle = document.getElementById('pf-lightbox-title');
    const closeBtn = lightbox.querySelector('.pf-lightbox-close');
    const prevBtn = lightbox.querySelector('.pf-lightbox-prev');
    const nextBtn = lightbox.querySelector('.pf-lightbox-next');

    let currentIndex = 0;
    const itemsArray = Array.from(galleryItems);

    function showImage(index) {
      if (index < 0) index = itemsArray.length - 1;
      if (index >= itemsArray.length) index = 0;
      currentIndex = index;

      const currentItem = itemsArray[currentIndex];
      const img = currentItem.querySelector('img');
      const title = currentItem.querySelector('.pf-gallery-title') ? currentItem.querySelector('.pf-gallery-title').innerText : 'Print Sample';

      lightboxImg.src = img.src;
      lightboxTitle.innerText = title;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    galleryItems.forEach((item, idx) => {
      item.addEventListener('click', () => showImage(idx));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    // Keyboard support: Escape, Left Arrow, Right Arrow
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }
})();
