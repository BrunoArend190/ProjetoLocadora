import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import clienteService from 'src/services/clienteService'; // Importa o Service Layer

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [],
    loading: false,
  }),

  getters: {
    totalClientes: (state) => state.clientes.length,
  },

  actions: {
    // Ação para buscar todos os clientes (READ)
    async fetchClientes() {
      this.loading = true;
      try {
        // O Store chama o Service para obter os dados via Axios
        const data = await clienteService.getAll(); 
        this.clientes = data;
      } catch (error) {
        console.error('Erro ao buscar clientes (Service Layer):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar lista de clientes. Verifique o JSON Server.'
        });
      } finally {
        this.loading = false;
      }
    },

    // Ação para deletar um cliente (DELETE)
    async deleteCliente(id) {
      try {
        // O Store chama o Service para executar a exclusão
        await clienteService.delete(id); 
        
        // Otimização: Remove da lista local (reatividade imediata)
        this.clientes = this.clientes.filter(c => c.id !== id);
        
        Notify.create({
          type: 'positive',
          message: 'Cliente excluído com sucesso!'
        });
      } catch (error) {
        console.error('Erro ao excluir cliente (Service Layer):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao excluir cliente. Tente novamente.'
        });
      }
    },
    
    // Esta ação é apenas um helper para forçar a recarga após o modal fechar.
    async saveCliente() {
      await this.fetchClientes();
    },
  },
});