/**
 * EKHDEMNI ADMIN — Categories Service
 * Manages service categories (AC, Plumbing, Electrical, etc.)
 */

import api from '../core/api.js';

const CategoriesService = {
  async getAll()            { return api.get('/categories'); },
  async getById(id)         { return api.get(`/categories/${id}`); },
  async create(payload)     { return api.post('/categories', payload); },
  async update(id, payload) { return api.put(`/categories/${id}`, payload); },
  async delete(id)          { return api.delete(`/categories/${id}`); },
  async toggleActive(id)    { return api.patch(`/categories/${id}/toggle`); },
};

export default CategoriesService;
