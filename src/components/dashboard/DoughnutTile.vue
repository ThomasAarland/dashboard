<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
  </BentoTile>
</template>

<script setup lang="ts">
import type { StatSummary } from '../../services/dashboardService';
import DoughnutChart from '../../widgets/DoughnutChart.vue';
import BentoTile from '../bento/BentoTile.vue';

const props = defineProps<{ stat: StatSummary }>()

// Hvis stat.details mangler, lager vi dummy-data for å unngå runtime error
const details = props.stat.details ?? [
  { owner: 'Ola Nordmann', value: 50 },
  { owner: 'Kari Nordmann', value: 25 },
  { owner: 'Per Hansen', value: 25 }
]

const chartData = {
  labels: details.map(d => d.owner),
  datasets: [
    {
      data: details.map(d => d.value),
      backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
      borderWidth: 1
    }
  ]
}

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
