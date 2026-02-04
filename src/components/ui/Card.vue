<template>
  <section class="card">
    <header v-if="$slots.header" class="card__header">
      <slot name="header" />
    </header>
    <div class="card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.card {
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.18);
  padding: 0.9rem 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card__header {
  font-weight: 600;
}

.card__footer {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>
