import mockHandler from './mockApi.js';

/**
 * Frontend-only API client — all data served from localStorage mock store.
 * No backend required.
 */
const api = {
  async request({ method = 'GET', url, data, responseType }) {
    try {
      const result = await mockHandler(method, url, data);
      if (responseType === 'blob') {
        return { data: result.data };
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  get(url, config = {}) {
    return this.request({ method: 'GET', url, responseType: config.responseType });
  },

  post(url, data) {
    return this.request({ method: 'POST', url, data });
  },

  put(url, data) {
    return this.request({ method: 'PUT', url, data });
  },

  delete(url) {
    return this.request({ method: 'DELETE', url });
  },
};

export default api;
