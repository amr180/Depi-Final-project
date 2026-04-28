/**
 * EKHDEMNI ADMIN — Providers Service
 * Full CRUD + status management for service providers.
 */

import api    from '../core/api.js';
import Config from '../core/config.js';

const ProvidersService = {
  /**
   * Get paginated + filtered list of providers.
   * @param {{ page?, perPage?, search?, category?, status?, experience? }} params
   */
  async getAll(params = {}) {
    return api.get('/providers', {
      page:    params.page     ?? Config.PAGINATION.DEFAULT_PAGE,
      perPage: params.perPage  ?? Config.PAGINATION.DEFAULT_PER_PAGE,
      ...params,
    });
  },

  /** @param {string} id */
  async getById(id) {
    return api.get(`/providers/${id}`);
  },

  /** @param {object} payload */
  async create(payload) {
    return api.post('/providers', payload);
  },

  /**
   * @param {string} id
   * @param {object} payload
   */
  async update(id, payload) {
    return api.put(`/providers/${id}`, payload);
  },

  /** Approve a pending provider */
  async approve(id) {
    return api.patch(`/providers/${id}/approve`);
  },

  /** Suspend a provider account */
  async suspend(id, reason = '') {
    return api.patch(`/providers/${id}/suspend`, { reason });
  },

  /** Reinstate / unsuspend a provider */
  async reinstate(id) {
    return api.patch(`/providers/${id}/reinstate`);
  },

  /** @param {string} id */
  async delete(id) {
    return api.delete(`/providers/${id}`);
  },

  /**
   * Fetch aggregate stats for the stats strip.
   * @returns {Promise<{ total, verified, pending, suspended }>}
   */
  async getStats() {
    return api.get('/providers/stats');
  },
};

export default ProvidersService;
