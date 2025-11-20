import { api } from 'boot/axios';

export default {
  
  // Função para buscar veículos (para a Tabela de Alertas de KM)
  async getAlertasVeiculos() {
    // Busca a coleção de veículos do JSON Server
    const response = await api.get('veiculos');
    return response.data;
  },

  getDadosAnaliticos() {
    // (Gráfico de Linha)
    const receitaMensal = {
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
      data: [10, 12, 18, 24] // Valores em mil (R$ 10 mil, etc.)
    };

    //(Gráfico de Pizza)
    const statusVeiculos = {
      total: 32,
      data: [
        
        { label: 'Disponíveis', value: 20.0, color: '#ffb300' },     // Amarelo
        { label: 'Em Movimento', value: 35.0, color: '#5e35b1' },    // Roxo
        { label: 'Reservados', value: 25.0, color: '#f4511e' },      // Laranja Escuro
        { label: 'Em Manutenção', value: 20.0, color: '#ff6f00' },   // Laranja
      ]
    };

    //(Gráfico de Barra)
    const performanceReservas = [
        { categoria: 'Sedan', reservas: 16 },
        { categoria: 'Hatch', reservas: 12 },
        { categoria: 'SUV', reservas: 15 },
        { categoria: 'Pickup', reservas: 4 },
    ];

    
    return { 
        receitaMensal, 
        statusVeiculos, 
        performanceReservas 
    };
  }
};