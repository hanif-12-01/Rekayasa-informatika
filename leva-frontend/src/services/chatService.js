import api from './api';

export const chatService = {
  async send(message, contextTaskId = null) {
    const payload = { message };
    if (contextTaskId) {
      payload.context_task_id = contextTaskId;
    }

    const { data } = await api.post('/chat', payload);
    return data.data;
  },

  async history(params = {}) {
    const { data } = await api.get('/chat/history', { params });
    return data.data;
  },

  async clearHistory() {
    const { data } = await api.delete('/chat/history');
    return data;
  },
};
