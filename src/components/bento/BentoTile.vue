<template>
  <article
    class="bento-tile"
    :class="{
      'bento-tile--interactive': clickable,
      'bento-tile--expanded': expanded
    }"
    :style="tileStyle"
  >
    <header v-if="title" class="bento-tile__header">
      <h2>{{ title }}</h2>
      <p v-if="subtitle" class="bento-tile__subtitle">{{ subtitle }}</p>
    </header>
    <div class="bento-tile__content">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  colSpan?: number
  expandedColSpan?: number
  expanded?: boolean
  clickable?: boolean
}

const props = defineProps<Props>()

const tileStyle = computed(() => {
  const baseSpan = props.colSpan ?? 1
  const span = props.expanded ? props.expandedColSpan ?? baseSpan : baseSpan
  return {
    gridColumn: `span ${span}`
  }
})
</script>

<style scoped>
.bento-tile {
  border-radius: 1rem;
  padding: 1rem 1.05rem;
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow:
    0 14px 40px rgba(var(--accent-2-rgb), 0.08),
    0 1px 0 rgba(58, 0, 107, 0.06) inset;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 170px;
  overflow: hidden;
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
}

.bento-tile--interactive {
  cursor: pointer;
}

.bento-tile:hover {
  transform: translateY(-2px);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(var(--accent-rgb), 0.25);
  border-color: rgba(var(--accent-rgb), 0.45);
}

.bento-tile--expanded {
  transform: translateY(0);
}

.bento-tile__header h2 {
  font-size: 0.98rem;
  font-weight: 650;
}

.bento-tile__subtitle {
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: 0.15rem;
}

.bento-tile__content {
  flex: 1;
  overflow: auto;
}
</style>
