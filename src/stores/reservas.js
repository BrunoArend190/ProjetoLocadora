import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import reservaService from 'src/services/reservaService'; // Importa o Service Layer

export const useReservasStore = defineStore('reservas', {
  state: () => ({
    reservas: [],
    loading: false,
  }),

  actions: {
    async fetchReservas() {
      this.loading = true;
      try {
        const data = await reservaService.getAll(); 
        this.reservas = data;
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar lista de reservas.'
        });
      } finally {
        this.loading = false;
      }
    },

    async deleteReserva(id) {
      try {
        await reservaService.delete(id);
        this.reservas = this.reservas.filter(r => r.id !== id);
        
        Notify.create({
          type: 'positive',
          message: 'Reserva excluída com sucesso!'
        });
      } catch (error) {
        console.error('Erro ao excluir reserva:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao excluir reserva.'
        });
      }
    },
    
    async saveReserva() {
        await this.fetchReservas();
    }
  },
});