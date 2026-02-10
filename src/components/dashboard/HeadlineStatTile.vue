<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <DoughnutChart v-if="stat.details?.length" :chart-data="chartData" :chart-options="chartOptions" />
    <StatCard v-else :label="stat.label" :value="stat.value" :trend="stat.trend" />
  </BentoTile>
</template>

<script setup lang="ts">
import type { StatSummary } from '../../services/dashboardService';
import DoughnutChart from '../../widgets/DoughnutChart.vue';
import StatCard from '../../widgets/StatCard.vue';
import BentoTile from '../bento/BentoTile.vue';

const props = defineProps<{ stat: StatSummary }>()

// Dersom stat.details finnes, lag chartData
const details = props.stat.details ?? []

const chartData = {
  labels: details.map(d => d.owner),
  datasets: [
    {
      data: details.map(d => d.value),
      backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#f44336'],
      borderWidth: 1
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
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
