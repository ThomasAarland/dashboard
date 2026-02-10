<template>
  <component
    :is="hasDetails ? DoughnutTile : StatCardWrapper"
    :stat="stat"
  />
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue';
import type { StatSummary } from '../../services/dashboardService';
import StatCard from '../../widgets/StatCard.vue';
import DoughnutTile from './DoughnutTile.vue';

const props = defineProps<{ stat: StatSummary & { details?: { owner: string; value: number }[] } }>()

// Sjekk om details finnes
const hasDetails = computed(() => Array.isArray(props.stat.details) && props.stat.details.length > 0)

// Wrapper for StatCard til å bruke samme prop uten JSX
const StatCardWrapper = defineComponent({
  props: { stat: Object },
  setup(p) {
    return () =>
      h(StatCard, {
        label: p.stat?.label,
        value: p.stat?.value,
        trend: p.stat?.trend
      })
  }
})
</script>
