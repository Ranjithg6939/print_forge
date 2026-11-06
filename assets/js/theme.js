/**
 * PrintForge – Theme & RTL Controller (theme.js)
 * Manages Dark/Light mode and RTL layout toggling with localStorage persistence.
 */

(function () {
  'use strict';

  // Apply saved theme immediately to prevent flash
  const savedTheme = localStorage.getItem('pf_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Apply saved direction immediately
  const savedDir = localStorage.getItem('pf_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle buttons
    const themeToggles = document.querySelectorAll('.pf-theme-toggle');
    updateThemeIcons(savedTheme);

    themeToggles.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('pf_theme', newTheme);
        updateThemeIcons(newTheme);
      });
    });

    // RTL toggle buttons
    const rtlToggles = document.querySelectorAll('.pf-rtl-toggle');
    updateRtlButtons(savedDir);

    rtlToggles.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('pf_dir', newDir);
        updateRtlButtons(newDir);
      });
    });
  });

  function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('.pf-theme-toggle i');
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill';
      } else {
        icon.className = 'bi bi-moon-stars-fill';
      }
    });
  }

  function updateRtlButtons(dir) {
    const buttons = document.querySelectorAll('.pf-rtl-toggle');
    buttons.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.title = dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left';
    });
  }
})();
