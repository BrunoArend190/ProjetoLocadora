// src/stores/dashboard.js
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import dashboardService from 'src/services/dashboardService'; 

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    veiculosAlertas: [],
    receita: { labels: [], data: [] },
    statusVeiculos: { total: 0, data: [] }, 
    performanceReservas: [], // Propriedade corrigida e inicializada como array []
    loading: false,
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        // --- 1. Processamento de Alertas de Manutenção ---
        const veiculos = await dashboardService.getAlertasVeiculos();
        
        const ALERTA_KM_CRITICO = 45000;
        const ALERTA_KM_MANUTENCAO = 15000;
        
        this.veiculosAlertas = veiculos.map(v => {
          let alerta = 'OK';
          let alertaColor = 'green-5';

          if (v.quilometragem >= ALERTA_KM_CRITICO) {
            alerta = 'Alerta Quilometragem';
            alertaColor = 'red-8';
          } else if (v.quilometragem >= ALERTA_KM_MANUTENCAO) {
            alerta = 'MANUTENÇÃO';
            alertaColor = 'red-5';
          }
          
          return {
            veiculo: `${v.marca} ${v.modelo} - ${v.categoria}`,
            placa: v.placa,
            quilometragem: `${v.quilometragem.toLocaleString('pt-BR')} Km`,
            alerta: alerta,
            alertaColor: alertaColor,
          };
        });

        // --- 2. Busca de Dados Analíticos (Gráficos) ---
        const analiticos = dashboardService.getDadosAnaliticos();
        this.receita = analiticos.receitaMensal;
        this.statusVeiculos = analiticos.statusVeiculos;
        
        // Atribuição da propriedade corrigida
        this.performanceReservas = analiticos.performanceReservas;

      } catch (error) {
        console.error('Erro ao buscar dados do Dashboard:', error);
        Notify.create({
          type: 'negative',
          message: 'Erro ao carregar dados do Dashboard. Verifique o serviço.'
        });
      } finally {
        this.loading = false;
      }
    },
  },
});