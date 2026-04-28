/**
 * EKHDEMNI ADMIN — Analytics Service
 * Fetches KPI data, revenue trends, category breakdowns, and transactions.
 */

import api from '../core/api.js';

const AnalyticsService = {
  /**
   * Fetch the four top-level KPI cards.
   * @returns {Promise<{ totalRevenue, activeUsers, completedOrders, newProviders }>}
   */
  async getKPIs() {
    return api.get('/analytics/kpis');
  },

  /**
   * Fetch monthly revenue trend for a given period.
   * @param {'12m'|'6m'|'quarter'} period
   * @returns {Promise<Array<{ month: string, revenue: number }>>}
   */
  async getRevenueTrend(period = '12m') {
    return api.get('/analytics/revenue-trend', { period });
  },

  /**
   * Fetch revenue breakdown by service category.
   * @returns {Promise<Array<{ category: string, percentage: number, color: string }>>}
   */
  async getCategoryBreakdown() {
    return api.get('/analytics/categories');
  },

  /**
   * Fetch high-value transactions (top earners).
   * @param {number} limit
   * @returns {Promise<Array<Transaction>>}
   */
  async getTopTransactions(limit = 10) {
    return api.get('/analytics/transactions/top', { limit });
  },

  /**
   * Fetch recently registered providers with their verification status.
   * @param {number} limit
   * @returns {Promise<Array<Provider>>}
   */
  async getNewProviders(limit = 5) {
    return api.get('/providers/recent', { limit });
  },
};

export default AnalyticsService;
