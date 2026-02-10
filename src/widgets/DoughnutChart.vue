<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { Chart } from 'chart.js'
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  chartData: ChartData
  chartOptions?: ChartOptions
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
  height: 300px !important;
}
</style>
