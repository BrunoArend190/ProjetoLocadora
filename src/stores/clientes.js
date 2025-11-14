import { defineStore } from 'pinia';
import { api } from 'boot/axios'; 
import { Notify } from 'quasar';

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [],
    loading: false,
  }),

  getters: {
    // Exemplo de um getter, útil para transformações de dados
    totalClientes: (state) => state.clientes.length,
  },

  actions: {
    // Ação para buscar todos os clientes (READ)
    async fetchClientes() {
      this.loading = true;
      try {
        const response = await api.get('clientes'); 
        this.clientes = response.data;
      } catch (error) {
        console.error('Erro ao buscar clientes (Pinia):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar lista de clientes.'
        });
      } finally {
        this.loading = false;
      }
    },

    // Ação para adicionar/editar um cliente (CREATE/UPDATE)
    // Embora o modal faça a chamada direta à API, esta ação é útil se precisar de lógica centralizada
    async saveCliente() { // Remove clienteData
    // Nota: Esta função é um placeholder, o evento 'clienteSaved' 
    // será o que realmente aciona a atualização da lista.
    await this.fetchClientes();
    },

    // Ação para deletar um cliente (DELETE)
    async deleteCliente(id) {
      try {
        await api.delete(`clientes/${id}`);
        
        // Remove da lista local (otimização)
        this.clientes = this.clientes.filter(c => c.id !== id);
        
        Notify.create({
          type: 'positive',
          message: 'Cliente excluído com sucesso!'
        });
      } catch (error) {
        console.error('Erro ao excluir cliente (Pinia):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao excluir cliente.'
        });
      }
    },
  },
});