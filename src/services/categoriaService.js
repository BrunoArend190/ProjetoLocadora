import { api } from 'boot/axios';

const endpoint = 'categorias';

export default {
  // READ (Listar todos)
  async getAll() {
    const response = await api.get(endpoint);
    return response.data;
  },

  // CREATE
  async create(data) {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  // UPDATE
  async update(id, data) {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  },

  // DELETE
  async delete(id) {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  },
};