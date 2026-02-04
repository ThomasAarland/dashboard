<template>
  <div class="stat-widget">
    <div class="stat-widget__label">{{ label }}</div>
    <div class="stat-widget__value">{{ value }}</div>
    <div v-if="trend" class="stat-widget__trend">
      {{ trend }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  trend?: string
}

const props = defineProps<Props>()
</script>

<style scoped>
.stat-widget {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-widget__label {
  font-size: 0.875rem;
  color: var(--muted);
}

.stat-widget__value {
  font-size: 1.5rem;
  font-weight: 600;
}

.stat-widget__trend {
  font-size: 0.75rem;
  color: rgba(var(--accent-rgb), 0.85);
}
</style>
