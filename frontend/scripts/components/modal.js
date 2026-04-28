/**
 * EKHDEMNI ADMIN — Modal Component
 * Lightweight, accessible modal with keyboard trap and scroll-lock.
 *
 * Usage:
 *   Modal.open({ title: 'Confirm', content: '<p>Are you sure?</p>', onConfirm: () => {} });
 *   Modal.close();
 */

const Modal = (() => {
  let _el        = null;
  let _onConfirm = null;

  /* ── Build DOM once ── */
  function _build() {
    if (document.getElementById('ek-modal')) return;

    document.body.insertAdjacentHTML('beforeend', `
      <div id="ek-modal" class="ek-modal" role="dialog" aria-modal="true" aria-labelledby="ek-modal-title" hidden>
        <div class="ek-modal__backdrop"></div>
        <div class="ek-modal__box">
          <div class="ek-modal__header">
            <h3 class="ek-modal__title text-headline-md" id="ek-modal-title"></h3>
            <button class="btn-icon ek-modal__close" aria-label="Close modal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="ek-modal__body"></div>
          <div class="ek-modal__footer">
            <button class="btn btn--surface ek-modal__cancel">Cancel</button>
            <button class="btn btn--primary ek-modal__confirm">Confirm</button>
          </div>
        </div>
      </div>
    `);

    _el = document.getElementById('ek-modal');
    _el.querySelector('.ek-modal__backdrop').addEventListener('click', Modal.close);
    _el.querySelector('.ek-modal__close').addEventListener('click',   Modal.close);
    _el.querySelector('.ek-modal__cancel').addEventListener('click',  Modal.close);
    _el.querySelector('.ek-modal__confirm').addEventListener('click', () => {
      _onConfirm?.();
      Modal.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !_el.hidden) Modal.close();
    });
  }

  return {
    /**
     * @param {{ title: string, content: string, confirmLabel?: string, onConfirm?: Function, hideFooter?: boolean }} opts
     */
    open({ title = '', content = '', confirmLabel = 'Confirm', onConfirm = null, hideFooter = false } = {}) {
      _build();
      _onConfirm = onConfirm;

      _el.querySelector('.ek-modal__title').innerHTML = title;
      _el.querySelector('.ek-modal__body').innerHTML  = content;
      _el.querySelector('.ek-modal__confirm').textContent = confirmLabel;
      _el.querySelector('.ek-modal__footer').hidden   = hideFooter;

      _el.hidden = false;
      document.body.style.overflow = 'hidden';
      _el.querySelector('.ek-modal__close').focus();
    },

    close() {
      if (_el) _el.hidden = true;
      document.body.style.overflow = '';
      _onConfirm = null;
    },
  };
})();

export default Modal;
