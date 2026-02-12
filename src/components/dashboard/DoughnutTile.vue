<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <DoughnutChart
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
  </BentoTile>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import type { StatSummary } from '../../services/dashboardService';
import DoughnutChart from '../../widgets/DoughnutChart.vue';
import BentoTile from '../bento/BentoTile.vue';

const props = defineProps<{ stat: StatSummary }>()

const details = props.stat.details ?? []
const usesSquareMeters = props.stat.id === 'area' || props.stat.id === 'buildings'

const chartData: ChartData<'doughnut'> = {
  labels: details.map(d => d.owner),
  datasets: [
    {
      data: details.map(d => d.value),
      backgroundColor: ['#4caf50', '#ff9800', '#2196f3'],
      borderWidth: 1
    }
  ]
}

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label(context) {
          const label = context.label || ''
          const value = Number(context.raw ?? 0)
          const suffix = usesSquareMeters ? 'm²' : '%'
          return `${label}: ${value} ${suffix}`
        }
      }
    },
    legend: {
      position: 'bottom'
    }
  }
}
</script>
