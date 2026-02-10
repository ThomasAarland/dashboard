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
  rowSpan?: number
  expandedRowSpan?: number
  expanded?: boolean
  clickable?: boolean
}

const props = defineProps<Props>()

const tileStyle = computed(() => {
  const baseColSpan = props.colSpan ?? 1
  const colSpan = props.expanded
    ? props.expandedColSpan ?? baseColSpan
    : baseColSpan

  const baseRowSpan = props.rowSpan ?? 1
  const rowSpan = props.expanded
    ? props.expandedRowSpan ?? baseRowSpan
    : baseRowSpan

  return {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`
  }
})
</script>

<style scoped>
.bento-tile {
  border-radius: 1rem;
  padding: 1rem 1.05rem;
  background: var(--panel);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 170px;
  overflow: hidden;
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
}
.bento-tile--interactive { cursor: pointer; }
.bento-tile__header h2 { font-size: 0.98rem; font-weight: 650; }
.bento-tile__subtitle { font-size: 0.875rem; color: var(--muted); margin-top: 0.15rem; }
.bento-tile__content { flex: 1; overflow: auto; }
</style>
