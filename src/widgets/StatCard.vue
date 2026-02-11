<template>
  <!-- Tiny KPI card with a pseudo gauge for extra visual feedback -->
  <div class="stat-card">
    <div class="stat-card__value">{{ value }}</div>
    <div v-if="trend" class="stat-card__trend">{{ trend }}</div>
    <div class="stat-card__gauge" :style="gaugeStyle">
      <span class="stat-card__percent">{{ percent }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string | number
  trend?: string
}

const props = defineProps<Props>()

// Best-effort attempt to extract a percentage-like signal from any stat value.
const percent = computed(() => {
  if (typeof props.value === 'number') {
    return clampPercent(props.value)
  }
  const raw = props.value?.toString().replace(/[^0-9.,]/g, '') ?? ''
  if (!raw) return 60
  const normalized = Number(raw.replace(',', '.'))
  return clampPercent(normalized)
})

const gaugeStyle = computed(() => ({
  background: `conic-gradient(var(--accent) ${percent.value}%, rgba(var(--accent-2-rgb), 0.15) 0)`
}))

function clampPercent(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 50
  if (value <= 10) return Math.min(95, Math.max(25, value * 10))
  if (value <= 100) return Math.min(95, Math.max(35, value))
  return 95
}
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.stat-card__value {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text);
}

.stat-card__trend {
  font-size: 0.85rem;
  color: var(--muted);
}

.stat-card__gauge {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  transition: background 200ms ease;
}

.stat-card__gauge::after {
  content: '';
  position: absolute;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #fff;
}

.stat-card__percent {
  position: relative;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-2);
}
</style>
