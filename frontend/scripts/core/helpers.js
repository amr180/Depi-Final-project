/**
 * EKHDEMNI ADMIN — Global Helper Functions
 * Pure utility functions with no side-effects.
 */

/**
 * Format a number as Egyptian Pounds.
 * @param {number} amount
 * @returns {string}  e.g. "12,400 ج.م"
 */
export function formatCurrency(amount) {
  return `${Number(amount).toLocaleString('ar-EG')} ج.م`;
}

/**
 * Format a date string into a human-readable Arabic date.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay  milliseconds
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Truncate a string to a given length.
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export function truncate(str, max = 40) {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

/**
 * Get query parameters from the current URL.
 * @returns {URLSearchParams}
 */
export function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration  ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.ek-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `ek-toast ek-toast--${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed; bottom:5.5rem; left:50%; transform:translateX(-50%);
    background:var(--color-inverse-surface); color:#fff;
    padding:.75rem 1.5rem; border-radius:9999px;
    font-size:.875rem; font-weight:600; z-index:9999;
    box-shadow:0 4px 16px rgba(0,0,0,0.2);
    animation:toastIn .25s ease;
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

/**
 * Generate a simple order-ID style string.
 * @returns {string}
 */
export function generateId(prefix = 'EK') {
  return `#${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}
