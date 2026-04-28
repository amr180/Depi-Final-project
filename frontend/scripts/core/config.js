/**
 * EKHDEMNI ADMIN — Global Configuration
 * Central place for all environment-level constants.
 */

const Config = Object.freeze({
  /** Base URL for the backend API */
  API_BASE_URL: 'https://api.ekhdemni.eg/api/v1',

  /** Default request timeout in milliseconds */
  REQUEST_TIMEOUT: 15_000,

  /** Local storage keys */
  STORAGE_KEYS: {
    ACCESS_TOKEN:  'ek_access_token',
    REFRESH_TOKEN: 'ek_refresh_token',
    USER:          'ek_user',
    THEME:         'ek_theme',
  },

  /** Page identifiers (must match data-page attributes) */
  PAGES: {
    DASHBOARD: 'dashboard',
    USERS:     'users',
    PROVIDERS: 'providers',
    ORDERS:    'orders',
    ANALYTICS: 'analytics',
    SETTINGS:  'settings',
  },

  /** Pagination defaults */
  PAGINATION: {
    DEFAULT_PAGE:     1,
    DEFAULT_PER_PAGE: 20,
  },
});

export default Config;
