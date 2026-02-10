<template>
  <div class="stat-card">
    <div class="stat-card__label">{{ label }}</div>
    <div class="stat-card__value">{{ value }}</div>
    <div v-if="trend" class="stat-card__trend">{{ trend }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  value?: string
  trend?: string
}>()
</script>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}
.stat-card__label {
  font-size: 0.9rem;
  color: var(--muted);
}
.stat-card__value {
  font-size: 1.2rem;
  font-weight: 600;
}
.stat-card__trend {
  font-size: 0.85rem;
  color: var(--accent);
}
</style>
