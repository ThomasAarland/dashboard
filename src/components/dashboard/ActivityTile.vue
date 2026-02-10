<template>
  <BentoTile
    title="Aktivitet i grunnboken"
    subtitle="De viktigste hendelsene knyttet til eiendommen"
    :col-span="2"
    :expanded-col-span="3"
    clickable
    :expanded="expanded"
    @click="emit('toggle')"
  >
    <ActivityWidget :activities="activities" />
  </BentoTile>
</template>

<script setup lang="ts">
import BentoTile from '../bento/BentoTile.vue'
import ActivityWidget from '../../widgets/ActivityWidget.vue'
import type { ActivityEntry } from '../../services/dashboardService'

const props = defineProps<{ activities: ActivityEntry[]; expanded: boolean }>()
const emit = defineEmits<{ (e: 'toggle'): void }>()
</script>
