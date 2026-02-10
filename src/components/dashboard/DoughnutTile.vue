<template>
  <!-- Vises kun hvis stat.details finnes og har minst én verdi -->
  <BentoTile
    v-if="stat.details && stat.details.length"
    :title="stat.label"
    :col-span="1"
    :expanded-col-span="2"
  >
    <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
  </BentoTile>
</template>

<script setup lang="ts">
import type { StatSummary } from '../../services/dashboardService';
import DoughnutChart from '../../widgets/DoughnutChart.vue';
import BentoTile from '../bento/BentoTile.vue';

// Props
const props = defineProps<{ stat: StatSummary }>()

// Bruk stat.details hvis det finnes, ellers dummy-data
const details = props.stat.details ?? [
  { owner: 'Ola Nordmann', value: 50 },
  { owner: 'Kari Nordmann', value: 25 },
  { owner: 'Per Hansen', value: 25 }
]

// Chart.js data
const chartData = {
  labels: details.map(d => d.owner),
  datasets: [
    {
      data: details.map(d => d.value),
      backgroundColor: ['#4caf50', '#ff9800', '#2196f3'], // Tilpass farger etter behov
      borderWidth: 1
    }
  ]
}

// Chart.js options
const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const label = context.label || ''
          const value = context.raw || 0
          return `${label}: ${value}%`
        }
      }
    },
    legend: {
      position: 'bottom'
    }
  }
}
</script>
