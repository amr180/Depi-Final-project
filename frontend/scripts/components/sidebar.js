/**
 * EKHDEMNI ADMIN — Sidebar Component Script
 * Handles:
 *  - Injecting sidebar + header + footer HTML into the page
 *  - Mobile open/close toggle
 *  - Active nav-link highlighting based on current page
 */

const SidebarComponent = {
  /** Inject all layout components into the DOM */
  async init() {
    await Promise.all([
      this._inject('./components-html/sidebar.html', '#sidebar-slot'),
      this._inject('./components-html/header.html',  '#header-slot'),
      this._inject('./components-html/footer.html',  '#footer-slot'),
    ]);
    this._highlightActive();
    this._bindEvents();
    this._syncUser();
  },

  /** Fetch an HTML partial and inject it into a slot element */
  async _inject(url, selector) {
    const slot = document.querySelector(selector);
    if (!slot) return;
    try {
      const res  = await fetch(url);
      const html = await res.text();
      slot.innerHTML = html;
    } catch (err) {
      console.warn(`[SidebarComponent] Could not load ${url}`, err);
    }
  },

  /** Mark the nav link matching the current page as active */
  _highlightActive() {
    const page  = document.body.dataset.page;
    if (!page) return;

    // Sidebar links
    document.querySelectorAll('.sidebar__nav-link').forEach(link => {
      link.classList.toggle('is-active', link.dataset.page === page);
    });

    // Bottom nav items
    document.querySelectorAll('.bottom-nav__item').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.page === page);
    });
  },

  /** Wire up hamburger, overlay, and bottom-nav buttons */
  _bindEvents() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    const toggle   = document.getElementById('sidebar-toggle');

    const open  = () => {
      sidebar?.classList.add('is-open');
      overlay?.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      sidebar?.classList.remove('is-open');
      overlay?.classList.remove('is-visible');
      document.body.style.overflow = '';
    };

    toggle?.addEventListener('click',  open);
    overlay?.addEventListener('click', close);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Bottom nav page navigation
    document.querySelectorAll('.bottom-nav__item[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        const routes = {
          dashboard: '/index.html',
          analytics: '/analytics.html',
          orders:    '/orders.html',
          settings:  '/settings.html',
        };
        if (routes[page]) window.location.href = routes[page];
      });
    });
  },

  /** Populate header with stored user data */
  _syncUser() {
    try {
      const raw  = localStorage.getItem('ek_user');
      if (!raw) return;
      const user = JSON.parse(raw);
      const nameEl   = document.getElementById('header-username');
      const avatarEl = document.getElementById('header-avatar');
      if (nameEl   && user.name)   nameEl.textContent = user.name;
      if (avatarEl && user.avatar) avatarEl.src        = user.avatar;
    } catch { /* no stored user, ignore */ }
  },
};

export default SidebarComponent;
