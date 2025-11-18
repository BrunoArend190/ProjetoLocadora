import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import categoriaService from 'src/services/categoriaService'; // Importa o Service Layer

export const useCategoriasVeiculosStore = defineStore('categoriasVeiculos', {
  state: () => ({
    categorias: [],
    loading: false,
  }),

  actions: {
    async fetchCategorias() {
      this.loading = true;
      try {
        // Store chama o Service
        const data = await categoriaService.getAll(); 
        
        this.categorias = data.map(cat => ({
          ...cat,
          valorDiariaFormatado: `R$ ${cat.valorDiaria.toFixed(2).replace('.', ',')}` 
        }));
      } catch (error) {
        console.error('Erro ao buscar categorias (Service Layer):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar lista de categorias.'
        });
      } finally {
        this.loading = false;
      }
    },

    async deleteCategoria(id) {
      try {
        // Store chama o Service
        await categoriaService.delete(id);
        this.categorias = this.categorias.filter(c => c.id !== id);
        
        Notify.create({
          type: 'positive',
          message: 'Categoria excluída com sucesso!'
        });
      } catch (error) {
        console.error('Erro ao excluir categoria (Service Layer):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao excluir categoria.'
        });
      }
    },
    
    async saveCategoria() {
        await this.fetchCategorias();
    }
  },
});