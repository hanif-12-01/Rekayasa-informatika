import api from './api';

export const bookmarkService = {
  async list(params = {}) {
    const { data } = await api.get('/bookmarks', { params });
    return data.data;
  },

  async create(toolId, note = null) {
    const payload = { tool_id: toolId };
    if (note) {
      payload.note = note;
    }

    const { data } = await api.post('/bookmarks', payload);
    return data.data;
  },

  async delete(toolId) {
    const { data } = await api.delete(`/bookmarks/${toolId}`);
    return data;
  },

  async tags() {
    const { data } = await api.get('/bookmarks/tags');
    return data.data.tags;
  },
};
