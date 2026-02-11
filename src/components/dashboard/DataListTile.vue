<template>
  <!-- Generic list tile used for most textual datasets -->
  <BentoTile
    :title="title"
    :subtitle="subtitle"
    :col-span="colSpan"
    :expanded-col-span="expandedColSpan"
    :clickable="clickable"
    :expanded="expanded"
    @click="handleClick"
  >
    <p v-if="metaText" class="tile-meta">{{ metaText }}</p>
    <ListWidget :title="listTitle" :items="items" />
  </BentoTile>
</template>

<script setup lang="ts">
import BentoTile from '../bento/BentoTile.vue'
import ListWidget from '../../widgets/ListWidget.vue'
import type { SimpleItem } from '../../services/dashboardService'

interface Props {
  title: string
  subtitle?: string
  listTitle?: string
  items: SimpleItem[]
  expanded: boolean
  colSpan?: number
  expandedColSpan?: number
  clickable?: boolean
  metaText?: string
}

const props = withDefaults(defineProps<Props>(), {
  colSpan: 1,
  expandedColSpan: 2,
  clickable: true,
  listTitle: undefined,
  subtitle: undefined,
  metaText: undefined
})

const emit = defineEmits<{ (e: 'toggle'): void }>()

// Only emit toggle requests when the tile is marked as interactive.
const handleClick = () => {
  if (props.clickable) {
    emit('toggle')
  }
}
</script>

<style scoped>
.tile-meta {
  margin: 0 0 0.5rem;
  font-weight: 600;
  color: var(--accent-2);
}
</style>
