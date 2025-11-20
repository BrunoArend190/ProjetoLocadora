// src/components/LinhaChart.vue
<template>
  <Line :data="data" :options="options" />
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

const data = {
  labels: props.chartData.labels,
  datasets: [
    {
      label: 'Receita Mensal',
      backgroundColor: '#9c27b0', 
      borderColor: '#9c27b0',
      data: props.chartData.data,
      tension: 0.1,
      fill: false,
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false, 
  animation: false, 
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `R$ ${context.parsed.y} mil`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return value + ' mil';
        }
      }
    }
  }
};
</script>