// src/stores/veiculos.js
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import veiculoService from 'src/services/veiculoService'; 

export const useVeiculosStore = defineStore('veiculos', {
  state: () => ({
    veiculos: [],
    loading: false,
  }),

  actions: {
    async fetchVeiculos() {
      this.loading = true;
      try {
        const data = await veiculoService.getAll(); 
        this.veiculos = data;
      } catch (error) {
        console.error('Erro ao buscar veículos (Service Layer):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar lista de veículos.'
        });
      } finally {
        this.loading = false;
      }
    },

    async deleteVeiculo(id) {
      try {
        await veiculoService.delete(id);
        this.veiculos = this.veiculos.filter(v => v.id !== id);
        
        Notify.create({
          type: 'positive',
          message: 'Veículo excluído com sucesso!'
        });
      } catch (error) {
        console.error('Erro ao excluir veículo (Service Layer):', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao excluir veículo.'
        });
      }
    },
    
    //Atualizar apenas o status de disponibilidade
    async updateVeiculoStatus(veiculoId, newStatus) {
      try {
        // 1. Encontra os dados locais (necessário para o PUT do JSON Server)
        let veiculoToUpdate = this.veiculos.find(v => v.id === veiculoId);
        
        // Fallback: se não encontrar local, tenta recarregar e buscar novamente
        if (!veiculoToUpdate) {
             await this.fetchVeiculos(); 
             veiculoToUpdate = this.veiculos.find(v => v.id === veiculoId);
             if (!veiculoToUpdate) {
                 throw new Error("Veículo não encontrado para atualização.");
             }
        }
        
        // 2. Prepara o payload com o novo status
        const payload = {
            ...veiculoToUpdate, 
            disponibilidade: newStatus,
        };

        // 3. Chama o Service para atualizar o veículo na API
        await veiculoService.update(veiculoId, payload); 

        // 4. Atualiza o estado local para reatividade
        const index = this.veiculos.findIndex(v => v.id === veiculoId);
        if (index !== -1) {
          this.veiculos[index].disponibilidade = newStatus;
        }

      } catch (error) {
        console.error('Erro ao atualizar status do veículo:', error);
        Notify.create({ type: 'negative', message: 'Erro ao atualizar status do veículo após reserva.' });
        this.fetchVeiculos(); // Recarrega para garantir a sincronia
      }
    },

    async saveVeiculo() {
        await this.fetchVeiculos();
    }
  },
});