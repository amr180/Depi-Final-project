/**
 * EKHDEMNI ADMIN — Users Service
 * CRUD operations for platform users.
 */

import api    from '../core/api.js';
import Config from '../core/config.js';

const UsersService = {
  /**
   * Get paginated list of users.
   * @param {object} params  { page, perPage, search, role }
   */
  async getAll(params = {}) {
    return api.get('/users', {
      page:    params.page    ?? Config.PAGINATION.DEFAULT_PAGE,
      perPage: params.perPage ?? Config.PAGINATION.DEFAULT_PER_PAGE,
      ...params,
    });
  },

  /** @param {string} id */
  async getById(id) {
    return api.get(`/users/${id}`);
  },

  /** @param {object} payload */
  async create(payload) {
    return api.post('/users', payload);
  },

  /**
   * @param {string} id
   * @param {object} payload
   */
  async update(id, payload) {
    return api.put(`/users/${id}`, payload);
  },

  /** @param {string} id */
  async deactivate(id) {
    return api.patch(`/users/${id}/deactivate`);
  },

  /** @param {string} id */
  async delete(id) {
    return api.delete(`/users/${id}`);
  },
};

export default UsersService;
