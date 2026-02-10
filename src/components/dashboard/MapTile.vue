<template>
  <BentoTile
    class="map-tile"
    title="Kart"
    subtitle="Plassering i kart (valgfritt)"
    :col-span="4"
    :expanded-col-span="4"
    :expanded="expanded"
  >
    <div class="map-placeholder">
      <div class="map-placeholder__pin" />
      <div class="map-placeholder__text">
        Kartvisning kan integreres her (Ambita kart / annen karttjeneste).
      </div>
    </div>
  </BentoTile>
</template>

<script setup lang="ts">
import BentoTile from '../bento/BentoTile.vue'

const props = defineProps<{ expanded: boolean }>()
</script>

<style scoped>
:deep(.map-tile) {
  min-height: 420px;
  position: sticky;
  top: 1rem;
  align-self: start;
}

.map-placeholder {
  height: 100%;
  min-height: 560px;
  border-radius: 0.9rem;
  border: 1px dashed rgba(var(--accent-2-rgb), 0.5);
  background:
    radial-gradient(480px 220px at 50% 0%, rgba(var(--accent-rgb), 0.15), transparent 60%),
    #ffffff;
  display: grid;
  place-items: center;
  gap: 0.5rem;
  padding: 1rem;
  box-shadow: 0 20px 45px rgba(var(--accent-2-rgb), 0.15);
}

.map-placeholder__pin {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: rgba(var(--accent-rgb), 0.95);
  box-shadow: 0 0 0 6px rgba(var(--accent-rgb), 0.18);
}

.map-placeholder__text {
  color: var(--muted);
  text-align: center;
  max-width: 36rem;
}
</style>
