/**
 * PrintForge – Dashboard Logic & Analytics (dashboard.js)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initDashboardSidebar();
    initSalesChart();
    initOrdersTable();
    initUserSearch();
    initJobInspectModal();
    initPrepressActions();
  });

  // Mobile Sidebar Toggle
  function initDashboardSidebar() {
    const sidebar = document.querySelector('.pf-dashboard-sidebar');
    const toggleBtn = document.querySelector('.pf-dash-sidebar-toggle');
    const closeBtn = document.querySelector('.pf-dash-sidebar-close');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('show');
      });
    }
  }

  // Render Sales Trend Chart via Chart.js or canvas fallback
  function initSalesChart() {
    const canvas = document.getElementById('pf-sales-chart');
    if (!canvas) return;

    if (typeof Chart !== 'undefined') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const textColor = isDark ? '#D8CEE3' : '#3D3547';
      const gridColor = isDark ? 'rgba(206,159,228,0.1)' : 'rgba(94,39,130,0.06)';

      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Offset Printing ($k)',
              data: [38, 45, 52, 48, 65, 72, 80, 85, 92, 105, 118, 130],
              borderColor: '#5E2782',
              backgroundColor: 'rgba(94, 39, 130, 0.16)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#5E2782'
            },
            {
              label: 'Book Specialty ($k)',
              data: [25, 30, 32, 40, 48, 55, 60, 68, 74, 82, 89, 98],
              borderColor: '#B983D1',
              backgroundColor: 'rgba(185, 131, 209, 0.12)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#B983D1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: textColor, font: { family: 'Outfit' } }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: textColor }
            }
          }
        }
      });
    }
  }

  // Orders Filter & Search
  function initOrdersTable() {
    const searchInput = document.getElementById('pf-order-search');
    const filterSelect = document.getElementById('pf-order-status-filter');
    const tableRows = document.querySelectorAll('.pf-order-row');

    function filterTable() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const selectedStatus = filterSelect ? filterSelect.value.toLowerCase() : 'all';

      tableRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        const status = row.getAttribute('data-status') || '';

        const matchesSearch = text.includes(searchTerm);
        const matchesStatus = selectedStatus === 'all' || status.toLowerCase() === selectedStatus;

        row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
      });
    }

    if (searchInput) searchInput.addEventListener('input', filterTable);
    if (filterSelect) filterSelect.addEventListener('change', filterTable);
  }

  // User management table search
  function initUserSearch() {
    const userSearch = document.getElementById('pf-user-search');
    const userRows = document.querySelectorAll('.pf-user-row');

    if (userSearch && userRows.length) {
      userSearch.addEventListener('input', () => {
        const query = userSearch.value.toLowerCase();
        userRows.forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
        });
      });
    }
  }

  // Toast notification helper
  function showDashboardToast(msg) {
    const toastEl = document.getElementById('pfDashboardToast');
    const msgEl = document.getElementById('pfToastMessage');
    if (!toastEl) return;
    if (msgEl) {
      msgEl.innerHTML = '<i class="bi bi-check-circle-fill text-success fs-5"></i> <span>' + msg + '</span>';
    }
    if (typeof bootstrap !== 'undefined') {
      const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
      toast.show();
    }
  }

  // Job Work Order Inspect Modal
  function initJobInspectModal() {
    const modalEl = document.getElementById('pfJobInspectModal');
    if (!modalEl || typeof bootstrap === 'undefined') return;
    const modal = new bootstrap.Modal(modalEl);

    const inspectBtns = document.querySelectorAll('.pf-btn-inspect');
    inspectBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const job = this.getAttribute('data-job') || '';
        const client = this.getAttribute('data-client') || '';
        const title = this.getAttribute('data-title') || '';
        const qty = this.getAttribute('data-qty') || '';
        const stock = this.getAttribute('data-stock') || '';
        const status = this.getAttribute('data-status') || '';
        const statusClass = this.getAttribute('data-status-class') || 'pf-status-processing';
        const total = this.getAttribute('data-total') || '';
        const notes = this.getAttribute('data-notes') || '';

        const jobIdEl = document.getElementById('inspectModalJobId');
        const clientEl = document.getElementById('inspectModalClient');
        const titleEl = document.getElementById('inspectModalTitle');
        const qtyEl = document.getElementById('inspectModalQty');
        const stockEl = document.getElementById('inspectModalStock');
        const statusEl = document.getElementById('inspectModalStatus');
        const totalEl = document.getElementById('inspectModalTotal');
        const notesEl = document.getElementById('inspectModalNotes');

        if (jobIdEl) jobIdEl.textContent = job;
        if (clientEl) clientEl.textContent = client;
        if (titleEl) titleEl.textContent = title;
        if (qtyEl) qtyEl.textContent = qty + ' units';
        if (stockEl) stockEl.textContent = stock;
        if (totalEl) totalEl.textContent = total;
        if (notesEl) notesEl.textContent = notes;
        if (statusEl) {
          statusEl.textContent = status;
          statusEl.className = 'pf-status-badge ' + statusClass + ' fs-6 px-3 py-1';
        }

        modal.show();
      });
    });

    const dlBtn = document.getElementById('inspectModalDownloadBtn');
    if (dlBtn) {
      dlBtn.addEventListener('click', function () {
        const jobId = document.getElementById('inspectModalJobId')?.textContent || 'Order';
        modal.hide();
        showDashboardToast('Production Work Order ' + jobId + ' exported as print-ready PDF.');
      });
    }
  }

  // Prepress Chat Reply & Run Acknowledge Actions
  function initPrepressActions() {
    const replyModalEl = document.getElementById('pfPrepressReplyModal');
    const replyForm = document.getElementById('prepressReplyForm');
    let replyModal = null;
    if (replyModalEl && typeof bootstrap !== 'undefined') {
      replyModal = new bootstrap.Modal(replyModalEl);
    }

    const replyBtns = document.querySelectorAll('.pf-reply-btn');
    replyBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const recipient = this.getAttribute('data-recipient') || 'Client';
        const job = this.getAttribute('data-job') || '';
        const quote = this.getAttribute('data-quote') || '';

        const subEl = document.getElementById('replyModalSubtitle');
        const authorEl = document.getElementById('replyModalContextAuthor');
        const textEl = document.getElementById('replyModalContextText');
        const inputEl = document.getElementById('prepressReplyText');

        if (subEl) subEl.textContent = 'Job ' + job + ' – ' + recipient;
        if (authorEl) authorEl.textContent = recipient + ':';
        if (textEl) textEl.textContent = '"' + quote + '"';
        if (inputEl) inputEl.value = '';

        if (replyModal) replyModal.show();
      });
    });

    if (replyForm) {
      replyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (typeof window.pfValidateForm === 'function' && !window.pfValidateForm(replyForm)) {
          return;
        }
        if (replyModal) replyModal.hide();
        showDashboardToast('Prepress response dispatched to client portal.');
        replyForm.reset();
        replyForm.querySelectorAll('textarea').forEach(el => {
          el.classList.remove('is-valid', 'is-invalid', 'pf-is-valid', 'pf-is-invalid');
          const parent = el.parentElement;
          parent?.querySelectorAll('.pf-error-feedback')?.forEach(fb => fb.remove());
        });
      });
    }

    const ackBtns = document.querySelectorAll('.pf-ack-btn');
    ackBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const recipient = this.getAttribute('data-recipient') || 'Client';
        const job = this.getAttribute('data-job') || '';
        const container = this.parentElement;
        if (container) {
          this.outerHTML = '<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill py-1 px-3 small"><i class="bi bi-check2-circle me-1"></i> Run Approved &amp; Scheduled</span>';
        }
        showDashboardToast('Production run for ' + job + ' acknowledged and queued on press.');
      });
    });
  }
})();
