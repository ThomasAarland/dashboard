<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <DoughnutChart
      v-if="hasDetails"
      :chart-data="chartData"
      :chart-options="chartOptions"
    />
    <div v-else class="no-data">
      Ingen detaljdata tilgjengelig
    </div>
  </BentoTile>
</template>

<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
import { computed } from 'vue'
import type { StatSummary } from '../../services/dashboardService'
import DoughnutChart from '../../widgets/DoughnutChart.vue'
import BentoTile from '../bento/BentoTile.vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Props med opsjonell details-array
const props = defineProps<{ stat: StatSummary & { details?: { owner: string; value: number }[] } }>()

// Sjekk om details finnes
const hasDetails = computed(() => Array.isArray(props.stat.details) && props.stat.details.length > 0)

// Doughnut-data
const chartData = computed(() => ({
  labels: props.stat.details?.map(d => d.owner) || [],
  datasets: [
    {
      data: props.stat.details?.map(d => d.value) || [],
      backgroundColor: [
        '#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#00bcd4', '#ffc107'
      ],
      borderWidth: 1
    }
  ]
}))

// Doughnut-options
const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.raw || 0
          return `${label}: ${value}%`
        }
      }
    },
    legend: { position: 'bottom' }
  }
}
</script>

<style scoped>
.no-data {
  text-align: center;
  color: var(--muted);
  padding: 1rem;
}
</style>
