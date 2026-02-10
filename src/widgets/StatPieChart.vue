<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
  </BentoTile>
</template>

<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import BentoTile from '../components/bento/BentoTile.vue';
import type { StatSummary } from '../services/dashboardService';

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{ stat: StatSummary & { details?: { owner: string; value: number }[] } }>()


// StatSummary må inneholde detaljene for hver eier, f.eks:
// stat.details = [{ owner: 'Alice', value: 50 }, { owner: 'Bob', value: 25 }, { owner: 'Charlie', value: 25 }]

const chartData = {
  labels: props.stat.details?.map(d => d.owner) || [],
  datasets: [
    {
      data: props.stat.details?.map(d => d.value) || [],
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
