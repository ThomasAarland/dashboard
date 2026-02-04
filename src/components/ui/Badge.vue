<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger'

interface Props {
  variant?: BadgeVariant
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral'
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: var(--muted);
}

.badge--neutral {
  border-color: rgba(var(--accent-rgb), 0.45);
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--text);
}

.badge--success {
  border-color: rgba(34, 197, 94, 0.25);
  color: rgba(134, 239, 172, 0.9);
}

.badge--warning {
  border-color: rgba(245, 158, 11, 0.25);
  color: rgba(253, 230, 138, 0.92);
}

.badge--danger {
  border-color: rgba(239, 68, 68, 0.25);
  color: rgba(254, 202, 202, 0.95);
}
</style>
