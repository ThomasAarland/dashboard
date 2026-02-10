<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <!-- Hvis detaljer finnes, vis DoughnutChart -->
    <template v-if="stat.details && stat.details.length">
      <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
    </template>

    <!-- Hvis ingen detaljer, vis StatCard -->
    <template v-else>
      <StatCard :label="stat.label" :value="stat.value" :trend="stat.trend" />
    </template>
  </BentoTile>
</template>

<script setup lang="ts">
import type { StatSummary } from '../../services/dashboardService';
import DoughnutChart from '../../widgets/DoughnutChart.vue';
import StatCard from '../../widgets/StatCard.vue';
import BentoTile from '../bento/BentoTile.vue';

// Props
const props = defineProps<{ stat: StatSummary }>()

// For DoughnutChart
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
