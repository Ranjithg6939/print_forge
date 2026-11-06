/**
 * PrintForge – Forms & Authentication Controller (forms.js)
 * Enterprise-grade Form Validation, Real-Time Input Feedback,
 * Sanitization, Toast Notifications & Simulated Workflow Processing.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // Global Toast Notification Helper
  // -------------------------------------------------------------
  window.pfShowToast = function (message, type = 'info') {
    let container = document.querySelector('.pf-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'pf-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pf-toast ${type}`;

    let iconClass = 'bi-info-circle-fill text-info';
    if (type === 'success') iconClass = 'bi-check-circle-fill text-success';
    if (type === 'error') iconClass = 'bi-exclamation-triangle-fill text-danger';
    if (type === 'warning') iconClass = 'bi-exclamation-circle-fill text-warning';

    toast.innerHTML = `
      <i class="bi ${iconClass}" style="font-size:1.25rem; flex-shrink:0;"></i>
      <div style="flex-grow:1; line-height:1.4;">${sanitizeHTML(message)}</div>
      <button type="button" style="background:none;border:none;color:#888;cursor:pointer;font-size:1.25rem;padding:0;line-height:1;" aria-label="Close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  };

  // -------------------------------------------------------------
  // Data Sanitization Helper
  // -------------------------------------------------------------
  function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // -------------------------------------------------------------
  // Core Validation Rule Functions
  // -------------------------------------------------------------
  const ValidationRules = {
    // Name validation: 2-60 characters, letters, spaces, hyphens, apostrophes only
    name(val, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'Please enter your full name.' : null;
      }
      if (/\d/.test(trimmed)) {
        return 'Name cannot contain numbers. Only letters, spaces, and hyphens are allowed.';
      }
      if (/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'-]/.test(trimmed)) {
        return 'Only letters, spaces, and hyphens are allowed in the name.';
      }
      if (trimmed.length < 2) {
        return 'Name must be at least 2 characters.';
      }
      return null;
    },

    // Email validation: RFC-standard email format requiring '@' and domain
    email(val, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'Please enter your email address.' : null;
      }
      if (!trimmed.includes('@')) {
        return "Email address must include an '@' symbol (e.g. name@company.com).";
      }
      const atParts = trimmed.split('@');
      if (!atParts[0] || atParts[0].trim() === '') {
        return "Please enter a username before the '@' symbol.";
      }
      if (!atParts[1] || atParts[1].trim() === '') {
        return "Please enter a domain after the '@' symbol (e.g. company.com).";
      }
      if (!atParts[1].includes('.')) {
        return "Domain after '@' must include a valid dot extension (e.g. .com, .net).";
      }
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(trimmed)) {
        return 'Please enter a valid email address (e.g. name@company.com).';
      }
      return null;
    },

    // Phone validation: 7-15 digits, allows +, -, (), spaces, no letters
    phone(val, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'Please enter your phone number.' : null;
      }
      if (/[a-zA-Z]/.test(trimmed)) {
        return 'Phone number cannot contain letters.';
      }
      if (!/^[+0-9\s().-]+$/.test(trimmed)) {
        return 'Phone number contains invalid characters.';
      }
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) {
        return 'Phone number must be between 7 and 15 digits.';
      }
      return null;
    },

    // Strict Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    password(val, isRequired = true) {
      if (!val) {
        return isRequired ? 'Password is required.' : null;
      }
      if (val.length < 8) {
        return 'Password must be at least 8 characters long.';
      }
      if (!/[A-Z]/.test(val)) {
        return 'Password must contain at least one uppercase letter (A-Z).';
      }
      if (!/[a-z]/.test(val)) {
        return 'Password must contain at least one lowercase letter (a-z).';
      }
      if (!/[0-9]/.test(val)) {
        return 'Password must contain at least one number (0-9).';
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(val)) {
        return 'Password must contain at least one special character (!@#$%^&*...).';
      }
      return null;
    },

    // Portal login password: required, min 4 characters
    loginPassword(val) {
      if (!val || !val.trim()) {
        return 'Please enter your password.';
      }
      if (val.length < 4) {
        return 'Password is too short.';
      }
      return null;
    },

    // Confirm password: must match primary password input
    confirmPassword(val, primaryVal) {
      if (!val) {
        return 'Please confirm your password.';
      }
      if (val !== primaryVal) {
        return 'Passwords do not match.';
      }
      return null;
    },

    // Subject / Service select or text: min 3 characters
    subject(val, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'Please select or enter a valid subject / service.' : null;
      }
      if (trimmed.length < 3) {
        return 'Subject must be at least 3 characters.';
      }
      return null;
    },

    // Message / Project notes: min 10 characters, prevent empty whitespace
    message(val, minLength = 10, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'Please enter your message or project notes.' : null;
      }
      if (trimmed.length < minLength) {
        return `Message must be at least ${minLength} characters (currently ${trimmed.length} chars).`;
      }
      return null;
    },

    // Number validation: numeric within range
    number(val, min = null, max = null, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'Please enter a valid numeric value.' : null;
      }
      const num = Number(trimmed);
      if (isNaN(num)) {
        return 'Please enter a valid number.';
      }
      if (min !== null && num < min) {
        return `Value must be at least ${min}.`;
      }
      if (max !== null && num > max) {
        return `Value cannot exceed ${max}.`;
      }
      return null;
    },

    // Date validation: valid date and cannot be in the past
    date(val, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'Please select a target date.' : null;
      }
      const selected = new Date(trimmed + 'T00:00:00');
      if (isNaN(selected.getTime())) {
        return 'Please enter a valid date format.';
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        return 'Date cannot be in the past. Please select today or a future date.';
      }
      return null;
    },

    // Checkbox agreement
    checkbox(checked, isRequired = true) {
      if (isRequired && !checked) {
        return 'You must accept the terms to proceed.';
      }
      return null;
    },

    // Generic required text (e.g. shipping address)
    text(val, minLength = 5, isRequired = true) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) {
        return isRequired ? 'This field is required.' : null;
      }
      if (trimmed.length < minLength) {
        return `Please enter at least ${minLength} characters.`;
      }
      return null;
    },

    // Trim Size validation: e.g. A4, A5, 6x9 in, 8.5x11 in, 210 x 297 mm
    trimSize(val) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) return null; // optional if empty

      // Standard recognized paper sizes
      const standardSizeRegex = /^(A[0-9]|B[0-9]|C[0-9]|Letter|Legal|Tabloid|Ledger|Custom)$/i;
      if (standardSizeRegex.test(trimmed)) return null;

      // Dimension format: e.g. "8.5x11", "6 x 9 in", "210x297mm", "4 * 6", "8.5 by 11"
      const dimRegex = /^\d+(\.\d+)?\s*(x|×|\*|-|\s+by\s+)\s*\d+(\.\d+)?(\s*(in|inch|inches|mm|cm|pt|px))?(\s+.*)?$/i;
      if (dimRegex.test(trimmed)) return null;

      // If it contains both digits and dimension/unit indicators
      if (/\d/.test(trimmed) && /(x|×|\*|by|mm|cm|in|inch)/i.test(trimmed)) {
        return null;
      }

      return 'Please enter valid dimensions (e.g. A4, 6x9 in, 8.5x11 in, 210x297 mm).';
    },

    // Finishing & Embellishment: words/terms, not pure numbers or random symbols
    finishing(val) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) return null; // optional if empty

      // Reject pure numbers (e.g. "3565656")
      if (/^\d+$/.test(trimmed.replace(/[\s,.-]/g, ''))) {
        return 'Finishing requirements must be described in words (e.g. Gold Foil, Spot UV, Matte Lam).';
      }

      // Must contain at least 3 letters
      const letterCount = trimmed.replace(/[^a-zA-Z]/g, '').length;
      if (letterCount < 3) {
        return 'Please describe finishing using text (min 3 letters, e.g. Spot UV, Gold Foil).';
      }

      return null;
    },

    // Company or organization name
    company(val) {
      const trimmed = val ? val.trim() : '';
      if (!trimmed) return null; // optional if empty

      if (/^\d+$/.test(trimmed.replace(/\s/g, ''))) {
        return 'Company name must contain letters (e.g. Acme Corp).';
      }
      if (trimmed.replace(/[^a-zA-Z]/g, '').length < 2) {
        return 'Please enter a valid company name (min 2 letters).';
      }
      return null;
    }
  };

  // -------------------------------------------------------------
  // DOM Field Error & Success Presentation
  // -------------------------------------------------------------
  function showFieldError(input, message) {
    if (!input) return;
    input.classList.remove('is-valid', 'pf-is-valid');
    input.classList.add('is-invalid', 'pf-is-invalid');
    input.setAttribute('aria-invalid', 'true');

    const group = input.closest('.input-group');
    if (group) {
      group.classList.remove('is-valid', 'pf-group-valid');
      group.classList.add('is-invalid', 'has-error', 'pf-group-invalid');
    }

    const fieldKey = input.id || input.name || 'field';
    const parent = group ? group.parentElement : input.parentElement;
    const targetAnchor = group || input;

    let feedback = parent.querySelector(`.pf-error-feedback[data-for="${fieldKey}"]`);
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'pf-error-feedback';
      feedback.setAttribute('data-for', fieldKey);
      feedback.setAttribute('role', 'alert');
      if (targetAnchor.nextSibling) {
        targetAnchor.parentNode.insertBefore(feedback, targetAnchor.nextSibling);
      } else {
        targetAnchor.parentNode.appendChild(feedback);
      }
    }

    feedback.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i><span>${sanitizeHTML(message)}</span>`;
    input.setAttribute('aria-describedby', fieldKey + '-error');
  }

  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('is-invalid', 'pf-is-invalid');
    input.classList.add('is-valid', 'pf-is-valid');
    input.setAttribute('aria-invalid', 'false');

    const group = input.closest('.input-group');
    if (group) {
      group.classList.remove('is-invalid', 'has-error', 'pf-group-invalid');
      group.classList.add('is-valid', 'pf-group-valid');
    }

    const fieldKey = input.id || input.name || 'field';
    const parent = group ? group.parentElement : input.parentElement;
    if (parent) {
      const feedback = parent.querySelector(`.pf-error-feedback[data-for="${fieldKey}"]`);
      if (feedback) feedback.remove();
    }
  }

  function resetFieldState(input) {
    if (!input) return;
    input.classList.remove('is-invalid', 'is-valid', 'pf-is-invalid', 'pf-is-valid');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    delete input.dataset.touched;

    const group = input.closest('.input-group');
    if (group) {
      group.classList.remove('is-invalid', 'is-valid', 'has-error', 'pf-group-invalid', 'pf-group-valid');
    }

    const fieldKey = input.id || input.name || 'field';
    const parent = group ? group.parentElement : input.parentElement;
    if (parent) {
      const feedback = parent.querySelector(`.pf-error-feedback[data-for="${fieldKey}"]`);
      if (feedback) feedback.remove();
    }
  }

  // -------------------------------------------------------------
  // Dynamic Single Field Evaluator
  // -------------------------------------------------------------
  window.pfValidateField = function (input) {
    if (!input || input.type === 'hidden' || input.disabled) return true;

    const isRequired = input.hasAttribute('required') || input.classList.contains('required');
    const val = input.value;
    const type = input.type ? input.type.toLowerCase() : '';
    const name = input.name ? input.name.toLowerCase() : '';
    const id = input.id ? input.id.toLowerCase() : '';
    let error = null;

    // Checkbox
    if (type === 'checkbox') {
      error = ValidationRules.checkbox(input.checked, isRequired);
    }
    // Specific password confirmation
    else if (id.includes('confirm') || name.includes('confirm')) {
      const form = input.closest('form');
      const passInput = form ? form.querySelector('#reg-pass, input[name="password"], input[type="password"]:not([id*="confirm"]):not([name*="confirm"])') : null;
      error = ValidationRules.confirmPassword(val, passInput ? passInput.value : '');
    }
    // Strict registration password
    else if (id === 'reg-pass' || (type === 'password' && input.closest('#pf-register-form'))) {
      error = ValidationRules.password(val, isRequired);
    }
    // Login password
    else if (type === 'password') {
      error = ValidationRules.loginPassword(val);
    }
    // Name fields
    else if (name === 'name' || id.includes('name') || input.dataset.validate === 'name') {
      error = ValidationRules.name(val, isRequired);
    }
    // Email fields
    else if (type === 'email' || name.includes('email') || id.includes('email') || input.dataset.validate === 'email') {
      error = ValidationRules.email(val, isRequired);
    }
    // Phone fields
    else if (type === 'tel' || name.includes('phone') || id.includes('phone') || input.dataset.validate === 'phone') {
      error = ValidationRules.phone(val, isRequired);
    }
    // Date fields
    else if (type === 'date' || name.includes('date') || id.includes('date') || input.dataset.validate === 'date') {
      error = ValidationRules.date(val, isRequired);
    }
    // Number fields
    else if (type === 'number') {
      const min = input.hasAttribute('min') ? parseFloat(input.getAttribute('min')) : null;
      const max = input.hasAttribute('max') ? parseFloat(input.getAttribute('max')) : null;
      error = ValidationRules.number(val, min, max, isRequired);
    }
    // Subject / Service selects
    else if (input.tagName === 'SELECT') {
      if (isRequired && (!val || val === '')) {
        error = 'Please select a valid option from the dropdown.';
      }
    }
    // Message / Project notes / Textareas
    else if (input.tagName === 'TEXTAREA' || name.includes('message') || id.includes('replytext')) {
      const minLen = parseInt(input.getAttribute('minlength') || '10', 10);
      error = ValidationRules.message(val, minLen, isRequired);
    }
    // Trim size fields (e.g. A4, 6x9 in, 8.5x11 in)
    else if (name === 'size' || id.includes('size') || input.dataset.validate === 'size') {
      error = ValidationRules.trimSize(val);
    }
    // Finishing & Embellishment fields
    else if (name === 'finishing' || id.includes('finishing') || input.dataset.validate === 'finishing') {
      error = ValidationRules.finishing(val);
    }
    // Company / Organization fields
    else if (name.includes('company') || id.includes('company') || input.dataset.validate === 'company') {
      error = ValidationRules.company(val);
    }
    // Shipping / Delivery Address
    else if (name.includes('address') || id.includes('address')) {
      error = ValidationRules.text(val, 5, isRequired);
    }
    // Generic text inputs
    else if (isRequired && (!val || !val.trim())) {
      error = 'This field cannot be left blank.';
    }

    if (error) {
      showFieldError(input, error);
      return false;
    } else {
      // If field was optional and left empty, do not show green tick
      if (!isRequired && (!val || !val.trim())) {
        resetFieldState(input);
      } else {
        clearFieldError(input);
      }
      return true;
    }
  };

  // -------------------------------------------------------------
  // Full Form Evaluator
  // -------------------------------------------------------------
  window.pfValidateForm = function (form) {
    if (!form) return true;
    const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not(:disabled), select:not(:disabled), textarea:not(:disabled)');
    let isValid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
      input.dataset.touched = 'true';
      const valid = window.pfValidateField(input);
      if (!valid) {
        isValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
      if (typeof window.pfShowToast === 'function') {
        window.pfShowToast('Please correct the highlighted form errors before proceeding.', 'error');
      }
    }

    return isValid;
  };

  // -------------------------------------------------------------
  // Initialize Real-time Listeners across all forms
  // -------------------------------------------------------------
  function initRealtimeValidation() {
    // 1. Set dynamic min="YYYY-MM-DD" on all date fields
    const todayStr = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(dateInput => {
      dateInput.setAttribute('min', todayStr);
    });

    // 2. Strict Keystroke Restriction on Name Fields (Letters, spaces, hyphens only)
    const nameInputs = document.querySelectorAll('input[name="name"], input[id*="name"], input[data-validate="name"], input[autocomplete="name"]');
    nameInputs.forEach(input => {
      // Prevent typing numbers or disallowed symbols directly
      input.addEventListener('keydown', function (e) {
        // Allow command/control shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        // Allow navigation and deletion keys
        if (['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Home', 'End'].includes(e.key)) {
          return;
        }

        // Only allow letters, spaces, hyphens, and apostrophes
        if (!/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'-]$/.test(e.key)) {
          e.preventDefault();
          this.dataset.touched = 'true';
          showFieldError(this, 'Numbers and symbols are blocked. Name field accepts letters only.');
        }
      });

      // Sanitize pasted or autofilled content immediately
      input.addEventListener('input', function () {
        const cleaned = this.value.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s'-]/g, '');
        if (cleaned !== this.value) {
          this.value = cleaned;
          this.dataset.touched = 'true';
          showFieldError(this, 'Disallowed characters removed. Only letters are accepted in name.');
        }
      });
    });

    // 3. Dynamic Real-time Email '@' and Domain Guide
    const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"], input[id*="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('input', function () {
        this.dataset.touched = 'true';
        if (this.value.length > 0 && !this.value.includes('@')) {
          showFieldError(this, "Email address must include an '@' symbol (e.g. name@company.com).");
        } else if (this.value.includes('@')) {
          window.pfValidateField(this);
        } else {
          resetFieldState(this);
        }
      });
    });

    // 4. Real-time Trim Size & Finishing input validators
    const sizeInputs = document.querySelectorAll('input[name="size"], input[id*="size"], input[data-validate="size"]');
    sizeInputs.forEach(input => {
      input.addEventListener('input', function () {
        if (this.value && this.value.trim().length > 0) {
          this.dataset.touched = 'true';
          window.pfValidateField(this);
        } else {
          resetFieldState(this);
        }
      });
    });

    const finishingInputs = document.querySelectorAll('input[name="finishing"], input[id*="finishing"], input[data-validate="finishing"]');
    finishingInputs.forEach(input => {
      input.addEventListener('input', function () {
        if (this.value && this.value.trim().length > 0) {
          this.dataset.touched = 'true';
          window.pfValidateField(this);
        } else {
          resetFieldState(this);
        }
      });
    });

    // 5. Attach general listeners to all inputs
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
      if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') return;

      // Blur event: mark touched and validate
      input.addEventListener('blur', function () {
        this.dataset.touched = 'true';
        window.pfValidateField(this);
      });

      // Input event: revalidate in real-time as user types
      input.addEventListener('input', function () {
        if (this.value && this.value.trim().length > 0) {
          this.dataset.touched = 'true';
          window.pfValidateField(this);
        } else if (this.dataset.touched === 'true') {
          window.pfValidateField(this);
        } else {
          resetFieldState(this);
        }

        // Cross-field revalidation: if password changes, revalidate confirm password
        if (this.id === 'reg-pass') {
          const confirmPass = this.closest('form')?.querySelector('#reg-confirm');
          if (confirmPass && confirmPass.dataset.touched === 'true') {
            window.pfValidateField(confirmPass);
          }
        }
      });

      // Change event for selects, dates, checkboxes
      input.addEventListener('change', function () {
        this.dataset.touched = 'true';
        window.pfValidateField(this);
      });
    });
  }

  // -------------------------------------------------------------
  // Form Submission Orchestrator
  // -------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initRealtimeValidation();
    initAuthForms();
    initQuoteForm();
    initContactForm();
    initNewsletterForms();
    initFileDropzone();
    checkAuthStatus();
  });

  // Check login state and update navbar user menu
  function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('pf_user') || 'null');
    const guestLinks = document.querySelectorAll('.pf-nav-guest');
    const userMenus = document.querySelectorAll('.pf-nav-user');
    const userNameSlots = document.querySelectorAll('.pf-user-display-name');

    if (user && user.isLoggedIn) {
      guestLinks.forEach(el => el.style.display = 'none');
      userMenus.forEach(el => el.style.display = 'inline-flex');
      userNameSlots.forEach(el => el.textContent = user.name || 'Admin User');
    } else {
      guestLinks.forEach(el => el.style.display = '');
      userMenus.forEach(el => el.style.display = 'none');
    }

    // Logout button listeners
    const logoutBtns = document.querySelectorAll('.pf-logout-btn');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('pf_user');
        window.pfShowToast('Logged out successfully.', 'info');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      });
    });
  }

  // Login, Register & Password Recovery Forms
  function initAuthForms() {
    // 1. Sign In Form
    const loginForm = document.getElementById('pf-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!window.pfValidateForm(loginForm)) return;

        if (loginForm.dataset.submitting === 'true') return;
        loginForm.dataset.submitting = 'true';

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Authenticating...';
        }

        const email = document.getElementById('login-email').value.trim();
        const mockUser = {
          email: email,
          name: email.split('@')[0].toUpperCase(),
          role: 'Production Manager',
          isLoggedIn: true
        };

        setTimeout(() => {
          localStorage.setItem('pf_user', JSON.stringify(mockUser));
          window.pfShowToast('Authentication successful! Welcome to PrintForge.', 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 900);
        }, 600);
      });
    }

    // 2. Registration Form
    const regForm = document.getElementById('pf-register-form');
    if (regForm) {
      regForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!window.pfValidateForm(regForm)) return;

        if (regForm.dataset.submitting === 'true') return;
        regForm.dataset.submitting = 'true';

        const submitBtn = regForm.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating Account...';
        }

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const newUser = {
          name: name,
          email: email,
          role: 'Client Partner',
          isLoggedIn: true
        };

        setTimeout(() => {
          localStorage.setItem('pf_user', JSON.stringify(newUser));
          window.pfShowToast('Account successfully created! Redirecting to portal...', 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1000);
        }, 700);
      });
    }

    // 3. Forgot Password Form
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!window.pfValidateForm(forgotForm)) return;

        const email = document.getElementById('resetEmail').value.trim();
        const feedback = document.getElementById('resetFeedback');
        const submitBtn = document.getElementById('sendResetBtn');

        if (feedback) feedback.classList.remove('d-none');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Dispatched';
        }

        setTimeout(() => {
          window.pfShowToast('Password recovery instructions sent to ' + email, 'success');
          const modalEl = document.getElementById('forgotPasswordModal');
          if (modalEl && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
          }
          forgotForm.reset();
          forgotForm.querySelectorAll('input').forEach(resetFieldState);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Recovery Link';
          }
          if (feedback) feedback.classList.add('d-none');
        }, 1200);
      });
    }
  }

  // Quote Request Form Controller (contact.html & home-2.html)
  function initQuoteForm() {
    const quoteForms = document.querySelectorAll('#pf-quote-form');
    quoteForms.forEach(quoteForm => {
      quoteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!window.pfValidateForm(quoteForm)) return;

        if (quoteForm.dataset.submitting === 'true') return;
        quoteForm.dataset.submitting = 'true';

        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const origHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Analyzing Specifications...';
        }

        const name = quoteForm.querySelector('[name="name"]')?.value || 'Client';
        const serviceSelect = quoteForm.querySelector('[name="service"]');
        const service = serviceSelect?.options[serviceSelect.selectedIndex]?.text || serviceSelect?.value || 'Commercial Offset Production';
        const quantitySelect = quoteForm.querySelector('[name="quantity"]');
        const quantity = quantitySelect?.options[quantitySelect.selectedIndex]?.text || quantitySelect?.value || '2,500 units';
        const estNum = 'PF-EST-' + Math.floor(10000 + Math.random() * 90000);

        setTimeout(() => {
          // 1. Launch Quote Success Confirmation Modal
          const modalEl = document.getElementById('pfQuoteSuccessModal');
          if (modalEl && typeof bootstrap !== 'undefined') {
            const refEl = document.getElementById('pfModalEstRef');
            const clientEl = document.getElementById('pfModalClientName');
            const productEl = document.getElementById('pfModalProduct');
            const qtyEl = document.getElementById('pfModalQuantity');
            const dlBtn = document.getElementById('pfModalDownloadSummaryBtn');

            if (refEl) refEl.textContent = '#' + estNum;
            if (clientEl) clientEl.textContent = name;
            if (productEl) productEl.textContent = service;
            if (qtyEl) qtyEl.textContent = quantity;

            if (dlBtn) {
              dlBtn.onclick = function () {
                window.pfShowToast(`Prepress Specification #${estNum} generated and exported as PDF.`, 'success');
              };
            }

            const successModal = new bootstrap.Modal(modalEl);
            successModal.show();
          }

          // 2. Secondary High-Contrast Status Toast
          window.pfShowToast(`Thank you, ${name}! Your print quote request (#${estNum}) has been submitted. Our prepress team will contact you within 2 hours.`, 'success');

          // 3. Reset form and states
          quoteForm.reset();
          quoteForm.querySelectorAll('input, select, textarea').forEach(resetFieldState);

          const dropzoneText = quoteForm.querySelector('.pf-dropzone-text');
          if (dropzoneText) {
            dropzoneText.innerHTML = '<strong>Click to browse</strong> or drag and drop your artwork / PDF dielines here';
          }

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHtml;
          }
          delete quoteForm.dataset.submitting;
        }, 750);
      });
    });
  }

  // General Contact Form Controller
  function initContactForm() {
    const contactForm = document.getElementById('pf-contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!window.pfValidateForm(contactForm)) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending Message...';
      }

      setTimeout(() => {
        window.pfShowToast('Message received! Our team will get back to you shortly.', 'success');
        contactForm.reset();
        contactForm.querySelectorAll('input, select, textarea').forEach(resetFieldState);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHtml;
        }
      }, 700);
    });
  }

  // Newsletter Subscriptions across all pages
  function initNewsletterForms() {
    const newsForms = document.querySelectorAll('.pf-newsletter-form');
    newsForms.forEach(f => {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = f.querySelector('input[type="email"]');
        if (!input) return;

        input.dataset.touched = 'true';
        if (!window.pfValidateField(input)) {
          if (typeof window.pfShowToast === 'function') {
            window.pfShowToast('Please enter a valid email address to subscribe.', 'error');
          }
          return;
        }

        const submitBtn = f.querySelector('button[type="submit"]');
        const origHtml = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        }

        setTimeout(() => {
          window.pfShowToast('Subscribed to PrintForge Technical Press Insights!', 'success');
          input.value = '';
          resetFieldState(input);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origHtml;
          }
        }, 500);
      });
    });
  }

  // Drag & drop file UI
  function initFileDropzone() {
    const dropzone = document.querySelector('.pf-file-dropzone');
    const fileInput = document.getElementById('quote-file-input');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        const file = fileInput.files[0];
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
        
        // File size limit check (100MB)
        if (file.size > 100 * 1024 * 1024) {
          window.pfShowToast(`File "${file.name}" exceeds 100 MB limit. Please compress or link via Cloud.`, 'error');
          fileInput.value = '';
          return;
        }

        dropzone.querySelector('.pf-dropzone-text').innerHTML = `<strong>Selected:</strong> ${sanitizeHTML(file.name)} (${fileSizeMB} MB)`;
        window.pfShowToast(`File "${file.name}" attached for prepress analysis.`, 'info');
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const file = e.dataTransfer.files[0];
        dropzone.querySelector('.pf-dropzone-text').innerHTML = `<strong>Selected:</strong> ${sanitizeHTML(file.name)}`;
        window.pfShowToast(`Attached: ${file.name}`, 'info');
      }
    });
  }
})();
