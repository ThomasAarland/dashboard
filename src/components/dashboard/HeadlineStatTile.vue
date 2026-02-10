<template>
  <DoughnutTile v-if="stat.details && stat.details.length" :stat="stat" />
  <StatCard v-else :label="stat.label" :value="stat.value" :trend="stat.trend" />
</template>

<script setup lang="ts">
import type { StatSummary } from '../../services/dashboardService';
import StatCard from '../../widgets/StatCard.vue';
import DoughnutTile from './DoughnutTile.vue';

const props = defineProps<{ stat: StatSummary }>()
</script>
