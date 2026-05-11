import api from './api';

export const taskService = {
  async submit(text, file = null) {
    const formData = new FormData();
    if (file) {
      formData.append('pdf_file', file);
    } else {
      formData.append('text', text);
    }

    const { data } = await api.post('/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
  },

  async list(params = {}) {
    const { data } = await api.get('/tasks', { params });
    return data.data;
  },

  async get(taskId) {
    const { data } = await api.get(`/tasks/${taskId}`);
    return data.data.task;
  },

  async status(taskId) {
    const { data } = await api.get(`/tasks/${taskId}/status`);
    return data.data;
  },

  pollStatus(taskId, onComplete, onError, intervalMs = 2000, timeoutMs = 60000) {
    const startTime = Date.now();

    const interval = setInterval(async () => {
      if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        onError(new Error('timeout'));
        return;
      }

      try {
        const { data } = await api.get(`/tasks/${taskId}/status`);

        if (data.data.status === 'completed') {
          clearInterval(interval);
          const { data: taskData } = await api.get(`/tasks/${taskId}`);
          onComplete(taskData.data.task);
          return;
        }

        if (data.data.status === 'failed') {
          clearInterval(interval);
          onError(new Error(data.data.error_message ?? 'Processing failed'));
        }
      } catch (error) {
        clearInterval(interval);
        onError(error);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  },

  async updateSubTask(taskId, subTaskId, status) {
    const { data } = await api.patch(`/tasks/${taskId}/sub-tasks/${subTaskId}`, { status });
    return data.data.sub_task;
  },

  async delete(taskId) {
    const { data } = await api.delete(`/tasks/${taskId}`);
    return data;
  },
};
