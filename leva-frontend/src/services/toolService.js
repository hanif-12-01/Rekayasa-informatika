import api from './api';

export const toolService = {
  async list(params = {}) {
    const { data } = await api.get('/tools', { params });
    return data.data;
  },

  async get(id) {
    const { data } = await api.get(`/tools/${id}`);
    return data.data.tool;
  },

  async search(q, params = {}) {
    const { data } = await api.get('/tools/search', {
      params: { q, ...params },
    });
    return data.data;
  },
};
