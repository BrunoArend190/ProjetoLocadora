<template>
  <Doughnut :data="data" :options="options" />
</template>

<script setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

const data = {
  labels: props.chartData.data.map(d => d.label),
  datasets: [
    {
      backgroundColor: props.chartData.data.map(d => d.color),
      data: props.chartData.data.map(d => d.value),
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
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += context.parsed + '%';
          }
          return label;
        }
      }
    }
  }
};
</script>