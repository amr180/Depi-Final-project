/**
 * EKHDEMNI ADMIN — Auth Service
 * Handles login, logout, token management, and current-user access.
 */

import api     from '../core/api.js';
import Storage from '../core/storage.js';
import Config  from '../core/config.js';

const AuthService = {
  /**
   * Authenticate a user with email + password.
   * Stores tokens in localStorage on success.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ user: object, accessToken: string }>}
   */
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    Storage.set(Config.STORAGE_KEYS.ACCESS_TOKEN,  data.accessToken);
    Storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    Storage.set(Config.STORAGE_KEYS.USER,          data.user);
    return data;
  },

  /**
   * Clear all auth data and redirect to login.
   */
  logout() {
    Storage.clearAll();
    window.location.href = './login.html';
  },

  /**
   * Retrieve the currently stored user object.
   * @returns {object|null}
   */
  getCurrentUser() {
    return Storage.get(Config.STORAGE_KEYS.USER, null);
  },

  /**
   * Check whether the session is still active.
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(Storage.get(Config.STORAGE_KEYS.ACCESS_TOKEN));
  },

  /**
   * Guard: redirect to login if not authenticated.
   * Call at the top of every protected page controller.
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = './login.html';
    }
  },
};

export default AuthService;
