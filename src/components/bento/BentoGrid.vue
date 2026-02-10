<template>
  <section class="bento-grid">
    <slot />
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.bento-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 180px;   /* ← denne er nøkkelen */
}


@media (max-width: 1200px) {
  .bento-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
