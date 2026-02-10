<template>
  <BentoTile :title="stat.label" :col-span="1" :expanded-col-span="2">
    <StatCard :label="stat.label" :value="stat.value" :trend="stat.trend" />
  </BentoTile>
</template>

<script setup lang="ts">
import BentoTile from '../bento/BentoTile.vue'
import StatCard from '../../widgets/StatCard.vue'
import type { StatSummary } from '../../services/dashboardService'

const props = defineProps<{ stat: StatSummary }>()
</script>
