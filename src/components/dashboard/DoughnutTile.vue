<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
  </BentoTile>
</template>

<script setup lang="ts">
import BentoTile from '../bento/BentoTile.vue'
import DoughnutChart from '../../widgets/DoughnutChart.vue'
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
import type { StatSummary } from '../../services/dashboardService'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Props med optional details
const props = defineProps<{ stat: StatSummary & { details?: { owner: string; value: number }[] } }>()

// Hvis details mangler, bruk dummydata
const chartData = computed(() => {
  const details = props.stat.details && props.stat.details.length
    ? props.stat.details
    : [
        { owner: 'Dummy 1', value: 40 },
        { owner: 'Dummy 2', value: 30 },
        { owner: 'Dummy 3', value: 30 }
      ]

  return {
    labels: details.map(d => d.owner),
    datasets: [
      {
        data: details.map(d => d.value),
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#00bcd4', '#ffc107'],
        borderWidth: 1
      }
    ]
  }
})

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
