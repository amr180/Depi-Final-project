/**
 * EKHDEMNI ADMIN — Dropdown Component
 * Closes on outside click and ESC.
 *
 * Usage (HTML):
 *   <div class="dropdown" data-dropdown>
 *     <button data-dropdown-trigger>Open</button>
 *     <div class="dropdown__menu" data-dropdown-menu>...</div>
 *   </div>
 *
 * Usage (JS):  DropdownComponent.init();
 */

const DropdownComponent = {
  init() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-dropdown-trigger]');

      if (trigger) {
        const dropdown = trigger.closest('[data-dropdown]');
        const menu     = dropdown?.querySelector('[data-dropdown-menu]');
        if (!menu) return;

        const isOpen = menu.classList.contains('is-open');
        this._closeAll();
        if (!isOpen) {
          menu.classList.add('is-open');
          dropdown.setAttribute('aria-expanded', 'true');
        }
        return;
      }

      // Click outside — close all
      if (!e.target.closest('[data-dropdown]')) this._closeAll();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeAll();
    });
  },

  _closeAll() {
    document.querySelectorAll('[data-dropdown-menu].is-open').forEach(menu => {
      menu.classList.remove('is-open');
      menu.closest('[data-dropdown]')?.setAttribute('aria-expanded', 'false');
    });
  },
};

export default DropdownComponent;
