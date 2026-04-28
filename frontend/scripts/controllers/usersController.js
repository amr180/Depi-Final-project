/**
 * EKHDEMNI ADMIN — usersController
 * Stub controller — implement per-page logic here.
 */
import AuthService from '../services/authService.js';

const Controller = {
  async init() {
    AuthService.requireAuth();
    console.log('[usersController] ready');
  },
};

export default Controller;
