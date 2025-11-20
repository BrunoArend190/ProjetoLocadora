// src/components/BarChart.vue
<template>
  <Bar :data="data" :options="options" />
</template>

<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  chartData: {
    type: Object, // Recebe o array performanceReservas
    required: true
  }
});


const labels = props.chartData.map(d => d.categoria);
const dataValues = props.chartData.map(d => d.reservas); 
const maxReservas = Math.max(...dataValues) || 16; 

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Reservas',
      backgroundColor: '#9c27b0', 
      data: dataValues,
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: maxReservas + (maxReservas * 0.2), 
      ticks: {
        stepSize: 5,
      },
      title: {
        display: false,
      }
    },
    x: {
      grid: {
        display: false, 
      }
    }
  }
};
</script>