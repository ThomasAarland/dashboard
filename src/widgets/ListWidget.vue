<template>
  <div class="list-widget">
    <h3 v-if="title" class="list-widget__title">{{ title }}</h3>
    <ul class="list-widget__list">
      <li v-for="item in items" :key="item.id" class="list-widget__item">
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface ListItem {
  id: string | number
  label: string
}

interface Props {
  title?: string
  items: ListItem[]
}

const props = defineProps<Props>()
</script>

<style scoped>
.list-widget__title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.list-widget__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.list-widget__item {
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.78);
}

.list-widget__item:last-child {
  border-bottom: none;
}
</style>
