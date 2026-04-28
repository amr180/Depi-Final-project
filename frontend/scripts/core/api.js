/**
 * EKHDEMNI ADMIN — API Client
 * Centralised fetch wrapper with auth headers, error handling,
 * and automatic token refresh.
 */

import Config  from './config.js';
import Storage from './storage.js';

/** @typedef {{ data?: any, error?: string, status: number }} ApiResponse */

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /* ─── Private Helpers ─────────────────────────────────────── */

  _getHeaders(extra = {}) {
    const token = Storage.get(Config.STORAGE_KEYS.ACCESS_TOKEN);
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    };
  }

  async _handleResponse(res) {
    const isJson = res.headers.get('content-type')?.includes('application/json');
    const body   = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      // 401 → try token refresh once
      if (res.status === 401) {
        const refreshed = await this._tryRefresh();
        if (!refreshed) {
          Storage.clearAll();
          window.location.href = '/login.html';
        }
      }
      const message = body?.message || body || `HTTP ${res.status}`;
      throw new ApiError(message, res.status, body);
    }
    return body;
  }

  async _tryRefresh() {
    const refreshToken = Storage.get(Config.STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      Storage.set(Config.STORAGE_KEYS.ACCESS_TOKEN,  data.accessToken);
      Storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  async _request(method, path, body = null, extraHeaders = {}) {
    const controller = new AbortController();
    const timerId    = setTimeout(() => controller.abort(), Config.REQUEST_TIMEOUT);

    try {
      const options = {
        method,
        headers: this._getHeaders(extraHeaders),
        signal:  controller.signal,
      };
      if (body !== null) options.body = JSON.stringify(body);

      const res = await fetch(`${this.baseURL}${path}`, options);
      return await this._handleResponse(res);
    } catch (err) {
      if (err.name === 'AbortError') throw new ApiError('Request timed out', 408);
      throw err;
    } finally {
      clearTimeout(timerId);
    }
  }

  /* ─── Public HTTP Methods ─────────────────────────────────── */

  get(path, params = {})         {
    const qs = new URLSearchParams(params).toString();
    return this._request('GET', qs ? `${path}?${qs}` : path);
  }
  post(path, body = {})          { return this._request('POST',   path, body); }
  put(path, body = {})           { return this._request('PUT',    path, body); }
  patch(path, body = {})         { return this._request('PATCH',  path, body); }
  delete(path)                   { return this._request('DELETE', path); }
}

/* ─── Custom Error Class ──────────────────────────────────────── */

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}

/* ─── Singleton Export ────────────────────────────────────────── */

const api = new ApiClient(Config.API_BASE_URL);
export default api;
