/**
 * EKHDEMNI ADMIN — rolesController
 * Stub controller — implement per-page logic here.
 */
import AuthService from '../services/authService.js';

const Controller = {
  async init() {
    AuthService.requireAuth();
    console.log('[rolesController] ready');
  },
};

export default Controller;
