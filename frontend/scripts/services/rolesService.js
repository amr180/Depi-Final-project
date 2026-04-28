/**
 * EKHDEMNI ADMIN — Roles Service
 * Manages admin roles and permission assignments.
 */

import api from '../core/api.js';

const RolesService = {
  async getAll()               { return api.get('/roles'); },
  async getById(id)            { return api.get(`/roles/${id}`); },
  async create(payload)        { return api.post('/roles', payload); },
  async update(id, payload)    { return api.put(`/roles/${id}`, payload); },
  async delete(id)             { return api.delete(`/roles/${id}`); },
  async getPermissions()       { return api.get('/permissions'); },
  async assignPermissions(roleId, permissionIds) {
    return api.post(`/roles/${roleId}/permissions`, { permissionIds });
  },
};

export default RolesService;
