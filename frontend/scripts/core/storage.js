/**
 * EKHDEMNI ADMIN — Storage Utilities
 * Thin wrapper around localStorage with JSON serialization.
 */

const Storage = {
  /**
   * Store a value (auto-serialises objects/arrays).
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      const serialised = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialised);
    } catch (err) {
      console.error('[Storage.set]', err);
    }
  },

  /**
   * Retrieve a value (auto-parses JSON if possible).
   * @param {string} key
   * @param {*} [fallback=null]
   * @returns {*}
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      try { return JSON.parse(raw); } catch { return raw; }
    } catch (err) {
      console.error('[Storage.get]', err);
      return fallback;
    }
  },

  /**
   * Remove a single key.
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear ALL admin keys from storage.
   */
  clearAll() {
    localStorage.clear();
  },
};

export default Storage;
