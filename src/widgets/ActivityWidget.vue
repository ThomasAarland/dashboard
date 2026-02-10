<template>
  <div class="activity-widget">
    <h3 class="activity-widget__title">Siste aktivitet</h3>
    <ul class="activity-widget__list">
      <li v-for="activity in activities" :key="activity.id" class="activity-widget__item">
        <span class="activity-widget__time">{{ activity.time }}</span>
        <span class="activity-widget__text">{{ activity.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface ActivityItem {
  id: string | number
  time: string
  text: string
}

interface Props {
  activities: ActivityItem[]
}

const props = defineProps<Props>()
</script>

<style scoped>
.activity-widget__title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.activity-widget__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.activity-widget__item {
  display: flex;
  gap: 0.5rem;
  padding: 0.35rem 0;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(var(--accent-rgb), 0.2);
}

.activity-widget__time {
  color: var(--muted);
  min-width: 5.5rem;
}

.activity-widget__text {
  color: var(--text);
}

.activity-widget__item:last-child {
  border-bottom: none;
}
</style>
