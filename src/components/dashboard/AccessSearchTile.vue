<template>
  <BentoTile
    title="Tilgang og eiendomssøk"
    subtitle="Innlogging via Ambita og oppslag i eiendommer du har grunnlag for å se"
    :col-span="2"
    :expanded-col-span="4"
    clickable
    :expanded="expanded"
    @click="emit('toggle')"
  >
    <div class="tile-stack">
      <div class="tile-row">
        <Badge>Ambita SSO</Badge>
        <Badge variant="success">Tilgang ok</Badge>
        <Badge>Gnr/Bnr: {{ activeProperty.gnrBnr }}</Badge>
        <Badge>{{ activeProperty.municipality }}</Badge>
      </div>

      <div class="search-row" @click.stop>
        <input
          v-model="searchTerm"
          class="search-row__input"
          type="text"
          name="property-search"
          placeholder="Søk: adresse / gnr-bnr / matrikkel-ID …"
          autocomplete="off"
          @keyup.enter="performSearch"
        />
        <button type="button" @click="performSearch" :disabled="searchLoading">
          {{ searchLoading ? 'Søker …' : 'Søk' }}
        </button>
        <button type="button" @click="confirmSelection" :disabled="!selectedProperty">
          Velg
        </button>
      </div>

      <div class="search-feedback" role="status" aria-live="polite">
        <template v-if="searchLoading">Søker etter eiendommer …</template>
        <template v-else-if="searchError">
          <span class="search-feedback__error">{{ searchError }}</span>
        </template>
        <template v-else-if="selectedProperty">
          <span class="search-feedback__hint">
            Klikk «Velg» for å laste {{ selectedProperty.address }} ({{ selectedProperty.gnrBnr }}).
          </span>
        </template>
        <template v-else-if="searchResults.length">
          Velg en av treffene nedenfor for å forhåndsvise en eiendom.
        </template>
        <template v-else>Viser nå data for {{ activeProperty.address }}.</template>
      </div>

      <ul class="search-results" v-if="searchResults.length" @click.stop>
        <li v-for="property in searchResults" :key="property.id">
          <button
            type="button"
            class="search-results__item"
            :class="{ 'search-results__item--active': selectedProperty && selectedProperty.id === property.id }"
            @click.stop="selectProperty(property)"
          >
            <span class="search-results__address">{{ property.address }}</span>
            <span class="search-results__meta">{{ property.gnrBnr }} · {{ property.municipality }}</span>
          </button>
        </li>
      </ul>

      <p>
        Etter innlogging kan du søke opp eiendommer du har tjenstlig behov for innsyn i. Når en
        eiendom er valgt, presenteres informasjonen her i et samlet og folkelig dashboard –
        langt mer forståelig enn rå tabeller fra grunnboken.
      </p>
    </div>
  </BentoTile>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BentoTile from '../bento/BentoTile.vue'
import Badge from '../ui/Badge.vue'

type PropertySearchResult = {
  id: string
  address: string
  municipality: string
  gnrBnr: string
}

const propertySuggestions: PropertySearchResult[] = [
  { id: 'prop-1', address: 'Eksempelveien 10', municipality: 'Oslo', gnrBnr: '12/345' },
  { id: 'prop-2', address: 'Fjordgløttveien 7', municipality: 'Bergen', gnrBnr: '88/21' },
  { id: 'prop-3', address: 'Solkroken 2B', municipality: 'Stavanger', gnrBnr: '45/109' },
  { id: 'prop-4', address: 'Myrstadveien 55', municipality: 'Trondheim', gnrBnr: '16/302' }
]

const props = defineProps<{ expanded: boolean }>()
const emit = defineEmits<{ (e: 'toggle'): void }>()

const defaultProperty: PropertySearchResult =
  propertySuggestions[0] ?? {
    id: 'default-property',
    address: 'Eksempelveien 10',
    municipality: 'Oslo',
    gnrBnr: '12/345'
  }

const searchTerm = ref('')
const searchResults = ref<PropertySearchResult[]>([])
const selectedProperty = ref<PropertySearchResult | null>(null)
const confirmedProperty = ref<PropertySearchResult>(defaultProperty)
const searchLoading = ref(false)
const searchError = ref<string | null>(null)

const activeProperty = computed(() => confirmedProperty.value)

const performSearch = () => {
  const term = searchTerm.value.trim().toLowerCase()
  searchResults.value = []
  selectedProperty.value = null

  if (!term) {
    searchError.value = 'Skriv inn adresse, gnr/bnr eller matrikkel-ID for å søke.'
    return
  }

  searchLoading.value = true
  searchError.value = null

  window.setTimeout(() => {
    const matches = propertySuggestions.filter((property) => {
      const haystack = `${property.address} ${property.gnrBnr} ${property.municipality}`.toLowerCase()
      return haystack.includes(term)
    })
    searchResults.value = matches
    if (!matches.length) {
      searchError.value = 'Fant ingen eiendommer som matcher søket.'
    }
    searchLoading.value = false
  }, 350)
}

const selectProperty = (property: PropertySearchResult) => {
  selectedProperty.value = property
  searchError.value = null
}

const confirmSelection = () => {
  if (selectedProperty.value) {
    confirmedProperty.value = selectedProperty.value
    searchResults.value = []
    selectedProperty.value = null
  }
}
</script>

<style scoped>
.tile-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tile-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-row__input {
  flex: 1;
  min-height: 42px;
  padding: 0 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  background: #f7f2ff;
  color: var(--text);
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
}

.search-row__input::placeholder {
  color: rgba(58, 0, 107, 0.45);
}

.search-row__input:focus {
  border-color: rgba(var(--accent-2-rgb), 0.5);
  box-shadow: 0 0 0 2px rgba(var(--accent-2-rgb), 0.25);
  background: #fff;
}

.search-feedback {
  font-size: 0.85rem;
  color: var(--muted);
  margin-top: 0.4rem;
}

.search-feedback__error {
  color: rgba(248, 113, 113, 0.95);
}

.search-feedback__hint {
  color: rgba(var(--accent-rgb), 0.95);
}

.search-results {
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.search-results li {
  margin: 0;
}

.search-results__item {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(var(--accent-rgb), 0.25);
  background: #fff;
  color: var(--text);
  text-align: left;
  padding: 0.6rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  transition: border-color 120ms ease, background 120ms ease;
}

.search-results__item:hover,
.search-results__item:focus-visible {
  border-color: rgba(var(--accent-rgb), 0.55);
}

.search-results__item--active {
  border-color: rgba(var(--accent-rgb), 0.85);
  background: rgba(var(--accent-rgb), 0.12);
}

.search-results__address {
  font-weight: 600;
}

.search-results__meta {
  font-size: 0.8rem;
  color: var(--muted);
}
</style>
