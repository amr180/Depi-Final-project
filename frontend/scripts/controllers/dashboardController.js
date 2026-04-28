/**
 * EKHDEMNI ADMIN — Dashboard Controller
 * Orchestrates all widgets on the analytics/dashboard page.
 * Follows the same Application-layer pattern as the .NET backend.
 */

import AuthService       from '../services/authService.js';
import AnalyticsService  from '../services/analyticsService.js';
import { formatCurrency, showToast } from '../core/helpers.js';

/* ─── Static mock data (replace with real API calls) ──────────── */
const MOCK_KPI = {
  totalRevenue:    1_248_500,
  activeUsers:     42_890,
  completedOrders: 12_604,
  newProviders:    856,
};

const MOCK_TREND = [
  { month: 'Jan', revenue: 72000  },
  { month: 'Feb', revenue: 58000  },
  { month: 'Mar', revenue: 65000  },
  { month: 'Apr', revenue: 95000  },
  { month: 'May', revenue: 84000  },
  { month: 'Jun', revenue: 118000 },
  { month: 'Jul', revenue: 107000 },
  { month: 'Aug', revenue: 141000 },
  { month: 'Sep', revenue: 132000 },
  { month: 'Oct', revenue: 158000 },
  { month: 'Nov', revenue: 147000 },
  { month: 'Dec', revenue: 152400 },
];

const MOCK_PROVIDERS = [
  { name: 'Cairo Electric Pros', status: 'verified', statusLabel: 'Verified 1h ago',   icon: 'verified',  iconColor: 'var(--color-secondary)', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALk6R3WNdABeo27Wc-r577wlT5IakUeNEBf0sa1Q8_xEKn9yn6rMw4UmYVUpyTXgGPK3altPZe2LNZFMDz0nZo-OnXAOpXTurZRT6Mrhks4UVKvuN5n35rs1yIMFp-Oda_eqjsc5MbaDwivmLOYrD1_IhZfgTvCxxf81rAxp9q0Xp7qcE808YvnROSC82LLt5INIG3c_Dj-me-kdUxbr1L6W6zOoAJG_nGmRNyCZmSbHNiFWz4UlMHW3RYhU1iK78V9hUdvLt1Q5E' },
  { name: 'Nile Cleaning Co.',   status: 'pending',  statusLabel: 'Pending Approval',  icon: 'pending',   iconColor: 'var(--color-outline)',    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU1nLfONO7w0Glowss-_TY6yo4RrTS7-DPIhWiMxq9HUDFwMTzT84gwmz67K0Lz1lrZ8TODAibJLx2oFCQpEdmwHpY4FHoKW9QM2VSkyYzGlmij0_NCj4g1wbXJ1anBvIMqA2W_Q0M85Bl41xK6WPPRvdHTW5_6U2oMTnCuD41PMgEDuf0Tlvyniy6Mw5RIkz3gja9vJIS_m_C6fqoqVeIIc0HxyoF6lMW6bEsBEW-iGZKIm5sz0FEuOm6KdSGD5y5QaSJre21ecU' },
  { name: 'Master Plumbers Giza',status: 'check',    statusLabel: 'Background Check',  icon: 'history',   iconColor: 'var(--color-outline)',    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATxixn_IK0IUvXStPNnuyct6YLex_pzAEg28gvf3SaK1ta-tgBdN9AMW-hUVxk7PSk5kS4A85qZBLfYhHFwfso6Lh9owda9GgrWA2VQ6B8uRbvm6tHpik7rrL30pNLXnlEJi74202AoxBHlP-_f34bplWQy3k4_M--zelJCp8Xi79oO6S65OBvlGALZvrF8v60obEOee8LhESaKHYb9_E-gFMWoB--5G0s-nk_SFhtwIeGDfOEf4uTd9ERjFJ7eSkhP3NDW-mbiUY' },
];

const MOCK_TRANSACTIONS = [
  { id: '#EK-9482', customer: 'Ahmed Mansour', service: 'Full Villa AC Revamp',   amount: 12400, status: 'completed', sparkline: [1,2,3,4] },
  { id: '#EK-9477', customer: 'Laila Hassan',  service: 'Smart Home Wiring',      amount: 8950,  status: 'in-progress', sparkline: [2,4,1,3] },
  { id: '#EK-9412', customer: 'Youssef Zaid',  service: 'Emergency Plumbing',     amount: 4200,  status: 'completed', sparkline: [3,4,2,4] },
];

/* ─── Controller ──────────────────────────────────────────────── */

const DashboardController = {
  async init() {
    AuthService.requireAuth();
    this._bindExportButtons();
    this._bindPeriodSelect();

    // Load all widgets in parallel
    await Promise.all([
      this._loadKPIs(),
      this._drawTrendChart(MOCK_TREND),
      this._renderTransactions(),
      this._renderProviders(),
    ]);
  },

  /* ── KPI Cards ── */
  async _loadKPIs() {
    // Swap with: const kpi = await AnalyticsService.getKPIs();
    const kpi = MOCK_KPI;

    this._setKPI('kpi-revenue',  formatCurrency(kpi.totalRevenue));
    this._setKPI('kpi-users',    kpi.activeUsers.toLocaleString('ar-EG'));
    this._setKPI('kpi-orders',   kpi.completedOrders.toLocaleString('ar-EG'));
    this._setKPI('kpi-providers',kpi.newProviders.toLocaleString('ar-EG'));
  },

  _setKPI(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  /* ── Revenue Trend Chart (SVG) ── */
  _drawTrendChart(data) {
    const svg  = document.getElementById('trend-svg');
    if (!svg) return;

    const W = 1000, H = 400, PAD = 40;
    const max     = Math.max(...data.map(d => d.revenue));
    const xStep   = (W - PAD * 2) / (data.length - 1);

    const toX = (i)   => PAD + i * xStep;
    const toY = (val) => PAD + (1 - val / max) * (H - PAD * 2);

    const pts  = data.map((d, i) => [toX(i), toY(d.revenue)]);
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `${line} L${pts[pts.length-1][0]},${H} L${pts[0][0]},${H} Z`;

    svg.innerHTML = `
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#0050d4" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#0050d4" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- Grid lines -->
      ${[0.25, 0.5, 0.75].map(f =>
        `<line x1="${PAD}" x2="${W-PAD}" y1="${toY(max*f).toFixed(1)}" y2="${toY(max*f).toFixed(1)}"
               stroke="var(--color-surface-container-high)" stroke-width="1"/>`
      ).join('')}
      <!-- Area -->
      <path d="${area}" fill="url(#areaGrad)"/>
      <!-- Line -->
      <path d="${line}" fill="none" stroke="var(--color-primary)" stroke-width="3" stroke-linejoin="round"/>
      <!-- Dots -->
      ${pts.map((p, i) => `
        <circle class="trend-dot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="5"
                fill="var(--color-primary)" stroke="white" stroke-width="2"
                data-month="${data[i].month}" data-value="${data[i].revenue}"/>
      `).join('')}
    `;

    // Tooltip on hover
    const tooltip = document.getElementById('trend-tooltip');
    svg.querySelectorAll('.trend-dot').forEach(dot => {
      dot.addEventListener('mouseenter', (e) => {
        if (!tooltip) return;
        tooltip.querySelector('.tt-month').textContent = dot.dataset.month;
        tooltip.querySelector('.tt-value').textContent = formatCurrency(dot.dataset.value);
        tooltip.classList.add('is-visible');

        const rect  = svg.getBoundingClientRect();
        const dotCx = parseFloat(dot.getAttribute('cx')) / W * rect.width;
        tooltip.style.left = `${dotCx}px`;
      });
      dot.addEventListener('mouseleave', () => tooltip?.classList.remove('is-visible'));
    });
  },

  /* ── Transactions Table ── */
  _renderTransactions() {
    const tbody = document.getElementById('transactions-tbody');
    if (!tbody) return;

    const statusMap = {
      'completed':   { label: 'Completed',   cls: 'status-badge--success' },
      'in-progress': { label: 'In Progress', cls: 'status-badge--warning' },
      'cancelled':   { label: 'Cancelled',   cls: 'status-badge--error'   },
    };

    tbody.innerHTML = MOCK_TRANSACTIONS.map(tx => {
      const st = statusMap[tx.status] ?? statusMap['completed'];
      const bars = tx.sparkline.map(h =>
        `<div class="sparkline-bar" style="height:${h * 4}px;opacity:${0.3 + h * 0.18}"></div>`
      ).join('');

      return `
        <tr class="data-table__row">
          <td class="font-mono text-label-md">${tx.id}</td>
          <td style="font-weight:700">${tx.customer}</td>
          <td>
            <div style="display:flex;flex-direction:column;gap:4px">
              <span style="font-size:var(--text-xs);color:var(--color-on-surface-variant)">${tx.service}</span>
              <div class="sparkline">${bars}</div>
            </div>
          </td>
          <td style="font-weight:700;color:var(--color-primary);text-align:right">${formatCurrency(tx.amount)}</td>
          <td><span class="status-badge ${st.cls}">${st.label}</span></td>
          <td style="text-align:right">
            <button class="btn-icon" data-tx-id="${tx.id}" aria-label="View insights">
              <span class="material-symbols-outlined" style="color:var(--color-outline)">insights</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Insights click
    tbody.querySelectorAll('[data-tx-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast(`Viewing insights for ${btn.dataset.txId}`, 'info');
      });
    });
  },

  /* ── Providers List ── */
  _renderProviders() {
    const list = document.getElementById('providers-list');
    if (!list) return;

    list.innerHTML = MOCK_PROVIDERS.map(p => `
      <div class="provider-card">
        <img class="provider-card__avatar" src="${p.img}" alt="${p.name}" width="48" height="48"/>
        <div class="provider-card__info">
          <p class="provider-card__name truncate">${p.name}</p>
          <p class="provider-card__meta">${p.statusLabel}</p>
        </div>
        <span class="material-symbols-outlined"
              style="color:${p.iconColor};${p.status==='verified'?'font-variation-settings:\'FILL\' 1':''}">${p.icon}</span>
      </div>
    `).join('');
  },

  /* ── Period Select ── */
  _bindPeriodSelect() {
    document.getElementById('period-select')?.addEventListener('change', (e) => {
      const periodMap = { '12m': MOCK_TREND, '6m': MOCK_TREND.slice(6), 'quarter': MOCK_TREND.slice(9) };
      this._drawTrendChart(periodMap[e.target.value] ?? MOCK_TREND);
    });
  },

  /* ── Export Buttons ── */
  _bindExportButtons() {
    document.getElementById('export-csv-btn')?.addEventListener('click', () => {
      showToast('CSV export started…', 'success');
    });
    document.getElementById('export-pdf-btn')?.addEventListener('click', () => {
      showToast('PDF generation started…', 'success');
    });
  },
};

export default DashboardController;
