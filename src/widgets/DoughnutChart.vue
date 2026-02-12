<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import {
  ArcElement,
  Chart,
  DoughnutController,
  Legend,
  Tooltip
} from 'chart.js';

import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  chartData: ChartData<'doughnut'>
  chartOptions?: ChartOptions<'doughnut'>
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

onMounted(() => {
  if (canvas.value) {
    chartInstance = new Chart(canvas.value, {
      type: 'doughnut',
      data: props.chartData,
      options: props.chartOptions
    })
  }
})

onBeforeUnmount(() => {
  chartInstance?.destroy()
  chartInstance = null
})

watch(
  () => props.chartData,
  (newData) => {
    if (chartInstance) {
      chartInstance.data = newData
      chartInstance.update()
    }
  },
  { deep: true }
)
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
