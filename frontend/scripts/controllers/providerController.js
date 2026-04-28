/**
 * EKHDEMNI ADMIN — Providers Controller
 * Manages the full providers list page:
 *  - Stats cards
 *  - Search + filter bar
 *  - Provider table with actions (view, edit, approve, suspend, reinstate)
 *  - Pagination
 *  - Confirm modals for destructive actions
 */

import AuthService      from '../services/authService.js';
import ProvidersService from '../services/providerService.js';
import Modal            from '../components/modal.js';
import { debounce, showToast, formatDate } from '../core/helpers.js';

/* ─── Mock Data (swap with real API calls) ────────────────────── */
const MOCK_STATS = {
  total:     2450,
  verified:  1890,
  pending:   518,
  suspended: 42,
};

const MOCK_PROVIDERS = [
  {
    id: 'PRO-88219', name: 'Ahmed El-Sayed',
    category: 'Plumbing Specialists', categoryKey: 'plumbing',
    experience: '8 Years', status: 'verified',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSHrecJIAlwBzQSQynad1nMLo__JGXTxcsG0Z3b0i2hVrocUbwbjHySBwe0em_c0268culEziMLHYnrh9ag8kEHhuDqlsgiidRbz7tJjEmO-dg6hm3ELYMPOzsfI9j6dBUbqbYHhHKiWxfQHiS2aVW9q-mviC4wKlC6LjmWQMDwHfLvFnyZVoNOQaUmvinZpFLO5mCr5PfiwhOA0eswt1TH30zSF1yujfINk4KWGtDiCj5Y0kQQyiUPC3zuHtX8yo1z6SH2vEY8mQ',
  },
  {
    id: 'PRO-90334', name: 'Sara Hassan',
    category: 'Electrical Systems', categoryKey: 'electrical',
    experience: '3 Years', status: 'pending',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFlK9vkB2NkKSzkqb_vs-4asJu4ps2Ml0qd6ME8hXWNhQmFjwovOLGd58pyDo4vKwdWpUKEK8cc4dzUTIAotVjKNiIjqLk-PqE3GV66S0H5IBwML6CdIh3d1ibzarHuRkwG5qP3LtFDgBiNzg-wKf1LTOH1BKMjSKf24rKkx1JGuAJCH8ax6p6bNuEU3IzqW1Hmde7mzgZBSe1hhanCpFVrdK8WfybWeOTzBrvgnCxvKafAqKLVsogMjxh8Fjz44WU2aQIIlDefrM',
  },
  {
    id: 'PRO-12558', name: 'Mostafa Mahmoud',
    category: 'House Cleaning', categoryKey: 'cleaning',
    experience: '12 Years', status: 'review',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6OMntttJlFI8BAXTJd4oPf7dU41sBKSjSEYIXwxIuoc_9b4XfcMkreKlOVMNWAdYFFGh1FMfwA-PdO65vJbaCjXLhU9aAaVyoSbYTCRs4zuoMqrud8OOZzBUrIkatkjnINGAHq20O-aJOJfoOCxSynKa4E1V9V4vhDdvtvBPHAsyFUjsxmaAjoC8HTcxowjIaeTI3C3U4lVIuOL8KDCWZGsjPEAw6GOuLyCV0tKq84-TwIimN8WN1O1Q4-RM2g_v7yoiat1YQbUM',
  },
  {
    id: 'PRO-00912', name: 'Karim Ali',
    category: 'Carpentry', categoryKey: 'carpentry',
    experience: '6 Years', status: 'suspended',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3PaQwbcIyfU_Xd6GuREA9axzEjlRHwJlO7oYVJLHy_sltSnR0zK-xBTTY147fsKEjoiDp4lnRaTPQfjKrpU9B_LqJkme1-DyA0v-MtrIW0Z5o4VvtfZzimZIhtR_cA2gKKRzEK6SBESJYtV_yhj_gvXXWG149BZ4ejJgHQ-PxDNXCjpfzseXNWM01NtfiJnSdbnuT0aSAFkq5eGNXu08TT1Yhn0CtAnjNYgtx2cuGaHL18s0PBiObsy9zZm-wtv1N5oX2H_WAJZA',
  },
];

/* ─── State ───────────────────────────────────────────────────── */
let _state = {
  providers:    [...MOCK_PROVIDERS],
  filteredList: [...MOCK_PROVIDERS],
  search:       '',
  category:     '',
  status:       '',
  experience:   '',
  page:         1,
  perPage:      10,
  total:        MOCK_PROVIDERS.length,
};

/* ─── Status Config ───────────────────────────────────────────── */
const STATUS_CONFIG = {
  verified:  { label: 'Verified',        cls: 'verification-status--verified',  icon: 'check_circle',   filled: true  },
  pending:   { label: 'Pending Approval', cls: 'verification-status--pending',   icon: 'schedule',       filled: false },
  review:    { label: 'Under Review',     cls: 'verification-status--review',    icon: 'search_check',   filled: false },
  suspended: { label: 'Suspended',        cls: 'verification-status--suspended', icon: 'error',          filled: true  },
};

/* ─── Controller ──────────────────────────────────────────────── */
const ProvidersController = {
  async init() {
    AuthService.requireAuth();
    this._renderStats(MOCK_STATS);
    this._renderTable();
    this._bindSearch();
    this._bindFilters();
    this._bindAddButton();
  },

  /* ── Stats Cards ── */
  _renderStats(stats) {
    this._setStat('stat-total',     stats.total.toLocaleString('ar-EG'));
    this._setStat('stat-verified',  stats.verified.toLocaleString('ar-EG'));
    this._setStat('stat-pending',   stats.pending.toLocaleString('ar-EG'));
    this._setStat('stat-suspended', stats.suspended.toLocaleString('ar-EG'));
  },

  _setStat(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  },

  /* ── Table Rendering ── */
  _renderTable() {
    const tbody = document.getElementById('providers-tbody');
    if (!tbody) return;

    const { filteredList, page, perPage } = _state;
    const start   = (page - 1) * perPage;
    const slice   = filteredList.slice(start, start + perPage);

    if (slice.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="5" style="text-align:center;padding:var(--sp-12);color:var(--color-on-surface-variant)">
          <span class="material-symbols-outlined" style="font-size:3rem;display:block;margin-bottom:var(--sp-3)">search_off</span>
          No providers match your filters.
        </td></tr>`;
      this._renderPagination();
      return;
    }

    tbody.innerHTML = slice.map(p => this._providerRow(p)).join('');
    this._bindRowActions(tbody);
    this._renderPagination();
  },

  _providerRow(p) {
    const s   = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.pending;
    const isSusp = p.status === 'suspended';
    const fill = s.filled ? "font-variation-settings:'FILL' 1" : '';

    const actionBtns = this._actionButtons(p);

    return `
      <tr data-id="${p.id}">
        <td>
          <div class="provider-identity">
            <img class="provider-identity__avatar ${isSusp ? 'provider-identity__avatar--suspended' : ''}"
                 src="${p.avatar}" alt="${p.name}" width="48" height="48"/>
            <div>
              <p class="provider-identity__name ${isSusp ? 'provider-identity__name--suspended' : ''}">${p.name}</p>
              <p class="provider-identity__id">ID: ${p.id}</p>
            </div>
          </div>
        </td>
        <td>
          <span class="category-badge category-badge--${p.categoryKey}">${p.category}</span>
        </td>
        <td style="text-align:center;font-size:var(--text-sm);font-weight:500">${p.experience}</td>
        <td>
          <span class="verification-status ${s.cls}">
            <span class="material-symbols-outlined" style="font-size:1.1rem;${fill}">${s.icon}</span>
            ${s.label}
          </span>
        </td>
        <td>
          <div class="row-actions">${actionBtns}</div>
        </td>
      </tr>
    `;
  },

  _actionButtons(p) {
    const view = `<button class="row-action-btn" data-action="view" title="View Profile">
      <span class="material-symbols-outlined">visibility</span></button>`;
    const edit = `<button class="row-action-btn" data-action="edit" title="Edit">
      <span class="material-symbols-outlined">edit</span></button>`;
    const approve = `<button class="row-action-btn row-action-btn--success" data-action="approve" title="Approve">
      <span class="material-symbols-outlined">check</span></button>`;
    const suspend = `<button class="row-action-btn row-action-btn--danger" data-action="suspend" title="Suspend">
      <span class="material-symbols-outlined">block</span></button>`;
    const reinstate = `<button class="row-action-btn row-action-btn--success" data-action="reinstate" title="Reinstate">
      <span class="material-symbols-outlined">lock_open</span></button>`;

    const map = {
      verified:  [view, edit, suspend],
      pending:   [view, approve],
      review:    [view, edit],
      suspended: [view, reinstate],
    };
    return (map[p.status] ?? [view]).join('');
  },

  /* ── Row Action Binding ── */
  _bindRowActions(tbody) {
    tbody.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row      = btn.closest('tr');
        const id       = row?.dataset.id;
        const provider = _state.providers.find(p => p.id === id);
        if (!provider) return;

        switch (btn.dataset.action) {
          case 'view':      this._viewProvider(provider); break;
          case 'edit':      this._editProvider(provider); break;
          case 'approve':   this._confirmApprove(provider); break;
          case 'suspend':   this._confirmSuspend(provider); break;
          case 'reinstate': this._confirmReinstate(provider); break;
        }
      });
    });
  },

  /* ── Modal Actions ── */
  _viewProvider(p) {
    const s = STATUS_CONFIG[p.status];
    Modal.open({
      title: 'Provider Profile',
      content: `
        <div style="display:flex;align-items:center;gap:var(--sp-4);margin-bottom:var(--sp-6)">
          <img src="${p.avatar}" style="width:4rem;height:4rem;border-radius:9999px;object-fit:cover" alt="${p.name}"/>
          <div>
            <p style="font-weight:700;font-size:var(--text-lg)">${p.name}</p>
            <p style="font-family:monospace;font-size:var(--text-xs);color:var(--color-on-surface-variant)">ID: ${p.id}</p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4)">
          <div><p style="font-size:var(--text-xs);font-weight:700;color:var(--color-on-surface-variant);text-transform:uppercase;margin-bottom:4px">Category</p>
               <p style="font-weight:600">${p.category}</p></div>
          <div><p style="font-size:var(--text-xs);font-weight:700;color:var(--color-on-surface-variant);text-transform:uppercase;margin-bottom:4px">Experience</p>
               <p style="font-weight:600">${p.experience}</p></div>
          <div><p style="font-size:var(--text-xs);font-weight:700;color:var(--color-on-surface-variant);text-transform:uppercase;margin-bottom:4px">Status</p>
               <p class="verification-status ${s.cls}" style="font-size:var(--text-sm)">${s.label}</p></div>
        </div>`,
      hideFooter: true,
    });
  },

  _editProvider(p) {
    showToast(`Opening editor for ${p.name}…`, 'info');
    // In production: navigate to /providers/edit.html?id=${p.id}
  },

  _confirmApprove(p) {
    Modal.open({
      title: 'Approve Provider',
      content: `<p>Approve <strong>${p.name}</strong> and grant verified status?</p>`,
      confirmLabel: 'Approve',
      onConfirm: () => this._applyStatusChange(p.id, 'verified', `${p.name} approved successfully.`),
    });
  },

  _confirmSuspend(p) {
    Modal.open({
      title: 'Suspend Provider',
      content: `<p>Are you sure you want to suspend <strong>${p.name}</strong>?<br/>They will lose access to the platform immediately.</p>`,
      confirmLabel: 'Suspend',
      onConfirm: () => this._applyStatusChange(p.id, 'suspended', `${p.name} has been suspended.`),
    });
  },

  _confirmReinstate(p) {
    Modal.open({
      title: 'Reinstate Provider',
      content: `<p>Reinstate <strong>${p.name}</strong> and restore their access?</p>`,
      confirmLabel: 'Reinstate',
      onConfirm: () => this._applyStatusChange(p.id, 'verified', `${p.name} has been reinstated.`),
    });
  },

  _applyStatusChange(id, newStatus, toast) {
    // In production: await ProvidersService.approve/suspend/reinstate(id)
    const provider = _state.providers.find(p => p.id === id);
    if (provider) provider.status = newStatus;
    this._applyFilters();
    this._renderTable();
    showToast(toast, 'success');
  },

  /* ── Search ── */
  _bindSearch() {
    const input = document.getElementById('provider-search');
    if (!input) return;
    input.addEventListener('input', debounce((e) => {
      _state.search = e.target.value.toLowerCase().trim();
      _state.page   = 1;
      this._applyFilters();
      this._renderTable();
    }, 250));
  },

  /* ── Filters ── */
  _bindFilters() {
    ['filter-category', 'filter-status', 'filter-experience'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => {
        _state.category   = document.getElementById('filter-category')?.value  ?? '';
        _state.status     = document.getElementById('filter-status')?.value    ?? '';
        _state.experience = document.getElementById('filter-experience')?.value ?? '';
        _state.page       = 1;
        this._applyFilters();
        this._renderTable();
      });
    });

    document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
      _state.search = _state.category = _state.status = _state.experience = '';
      _state.page   = 1;
      ['filter-category', 'filter-status', 'filter-experience'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const searchEl = document.getElementById('provider-search');
      if (searchEl) searchEl.value = '';
      this._applyFilters();
      this._renderTable();
    });
  },

  _applyFilters() {
    const { providers, search, category, status, experience } = _state;

    _state.filteredList = providers.filter(p => {
      const matchSearch   = !search   || p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search);
      const matchCategory = !category || p.categoryKey === category;
      const matchStatus   = !status   || p.status      === status;
      return matchSearch && matchCategory && matchStatus;
    });

    _state.total = _state.filteredList.length;
    this._renderPaginationInfo();
  },

  /* ── Pagination ── */
  _renderPagination() {
    this._renderPaginationInfo();
    const controls = document.getElementById('pagination-controls');
    if (!controls) return;

    const { page, perPage, filteredList } = _state;
    const totalPages = Math.max(1, Math.ceil(filteredList.length / perPage));

    const prevBtn = `<button class="pagination-btn" id="prev-page" ${page === 1 ? 'disabled' : ''}>
      <span class="material-symbols-outlined">chevron_left</span></button>`;

    const nextBtn = `<button class="pagination-btn" id="next-page" ${page === totalPages ? 'disabled' : ''}>
      <span class="material-symbols-outlined">chevron_right</span></button>`;

    // Page number buttons (show max 5 around current)
    let pageNums = '';
    const range = this._pageRange(page, totalPages);
    range.forEach(n => {
      if (n === '…') {
        pageNums += `<span class="pagination-ellipsis">…</span>`;
      } else {
        pageNums += `<button class="pagination-btn ${n === page ? 'is-active' : ''}" data-page="${n}">${n}</button>`;
      }
    });

    controls.innerHTML = prevBtn + pageNums + nextBtn;

    controls.querySelector('#prev-page')?.addEventListener('click', () => this._goToPage(page - 1));
    controls.querySelector('#next-page')?.addEventListener('click', () => this._goToPage(page + 1));
    controls.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => this._goToPage(Number(btn.dataset.page)));
    });
  },

  _pageRange(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
    if (current >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total];
    return [1, '…', current-1, current, current+1, '…', total];
  },

  _goToPage(n) {
    const totalPages = Math.ceil(_state.filteredList.length / _state.perPage);
    _state.page = Math.max(1, Math.min(n, totalPages));
    this._renderTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  _renderPaginationInfo() {
    const infoEl = document.getElementById('pagination-info');
    if (!infoEl) return;
    const { page, perPage, filteredList } = _state;
    const start = Math.min((page - 1) * perPage + 1, filteredList.length || 1);
    const end   = Math.min(page * perPage, filteredList.length);
    infoEl.innerHTML = `Showing <strong>${start}–${end}</strong> of <strong>${filteredList.length.toLocaleString('ar-EG')}</strong> providers`;
  },

  /* ── Add Provider ── */
  _bindAddButton() {
    document.getElementById('add-provider-btn')?.addEventListener('click', () => {
      showToast('Opening Add Provider form…', 'info');
      // In production: window.location.href = '/providers/new.html'
    });
  },
};

export default ProvidersController;
