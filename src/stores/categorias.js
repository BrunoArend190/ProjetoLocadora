import { defineStore } from 'pinia';
import { api } from 'boot/axios'; 
import { Notify } from 'quasar';

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [],
    loading: false,
  }),

  actions: {
    async fetchCategorias() {
      this.loading = true;
      try {
        const response = await api.get('categorias'); 
        this.categorias = response.data.map(cat => ({
          ...cat,
          // Formata o valor da diária para exibição (R$ XX,00)
          valorDiariaFormatado: `R$ ${cat.valorDiaria.toFixed(2).replace('.', ',')}` 
        }));
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar lista de categorias.'
        });
      } finally {
        this.loading = false;
      }
    },

    // Ação para deletar (necessita confirmação no componente)
    async deleteCategoria(id) {
      try {
        await api.delete(`categorias/${id}`);
        this.categorias = this.categorias.filter(c => c.id !== id);
        
        Notify.create({
          type: 'positive',
          message: 'Categoria excluída com sucesso!'
        });
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao excluir categoria.'
        });
      }
    },
    
    // Ação genérica para salvar (usada para forçar o re-fetch após o modal)
    async saveCategoria() {
        await this.fetchCategorias();
    }
  },
});