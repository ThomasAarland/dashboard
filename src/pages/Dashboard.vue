<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BentoGrid from '../components/bento/BentoGrid.vue'
import BentoTile from '../components/bento/BentoTile.vue'
import Badge from '../components/ui/Badge.vue'
import { useDashboard } from '../composables/useDashboard'
import ActivityWidget from '../widgets/ActivityWidget.vue'
import ListWidget from '../widgets/ListWidget.vue'
import StatWidget from '../widgets/StatWidget.vue'

const { data, loading, error } = useDashboard()

interface PropertySearchResult {
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

const expandedTiles = reactive<Record<string, boolean>>({})

const toggleExpand = (id: string) => {
  expandedTiles[id] = !expandedTiles[id]
}
</script>

<template>
  <main class="dashboard-page">
    <header class="dashboard-page__header">
      <div>
        <h1>Eiendomsinnsyn</h1>
        <p>
          Bruker er logget inn via Ambitas autentiseringsløsning og får et samlet,
          forståelig bilde av valgt eiendom – langt mer folkelig enn rådata fra grunnboken.
        </p>
      </div>
    </header>

    <section v-if="loading" class="dashboard-page__state">
      Laster eiendomsdata …
    </section>
    <section v-else-if="error" class="dashboard-page__state dashboard-page__state--error">
      {{ error }}
    </section>

    <section v-else-if="data" class="dashboard-page__content">
      <BentoGrid>
        <!-- Tilgang og eiendomssøk -->
        <BentoTile
          title="Tilgang og eiendomssøk"
          subtitle="Innlogging via Ambita og oppslag i eiendommer du har grunnlag for å se"
          :col-span="2"
          :expanded-col-span="4"
          clickable
          :expanded="!!expandedTiles['access']"
          @click="toggleExpand('access')"
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

        <!-- Nøkkeltall -->
        <BentoTile
          title="Nøkkeltall"
          subtitle="Overordnet bilde av eiendommen"
          :col-span="2"
          :expanded-col-span="4"
          clickable
          :expanded="!!expandedTiles['stats']"
          @click="toggleExpand('stats')"
        >
          <div class="headline-stats">
            <StatWidget
              v-for="stat in data.headlineStats"
              :key="stat.id"
              :label="stat.label"
              :value="stat.value"
              :trend="stat.trend"
            />
          </div>
        </BentoTile>

        <!-- Grunnleggende eiendomsdata (areal m.m.) -->
        <BentoTile
          title="Grunnleggende eiendomsdata"
          :col-span="2"
          :expanded-col-span="3"
          clickable
          :expanded="!!expandedTiles['basic']"
          @click="toggleExpand('basic')"
        >
          <ListWidget title="Areal og nøkkelinfo" :items="data.basicData" />
        </BentoTile>

        <!-- Bygninger -->
        <BentoTile
          title="Bygninger tilknyttet eiendommen"
          :col-span="2"
          :expanded-col-span="3"
          clickable
          :expanded="!!expandedTiles['buildings']"
          @click="toggleExpand('buildings')"
        >
          <ListWidget title="Bygninger" :items="data.buildings" />
        </BentoTile>

        <!-- Eierandeler -->
        <BentoTile
          title="Eierandeler"
          :col-span="2"
          :expanded-col-span="3"
          clickable
          :expanded="!!expandedTiles['owners']"
          @click="toggleExpand('owners')"
        >
          <ListWidget title="Hvem eier – og hvor stor andel" :items="data.ownershipShares" />
        </BentoTile>

        <!-- Eiendommens beliggenhet: adresse, kommune, krets -->
        <BentoTile
          title="Eiendommens beliggenhet"
          :col-span="2"
          :expanded-col-span="3"
          clickable
          :expanded="!!expandedTiles['location']"
          @click="toggleExpand('location')"
        >
          <ListWidget title="Adresse, kommune, krets" :items="data.location" />
        </BentoTile>

        <!-- Kart (valgfritt) – placeholder for kartkomponent -->
        <BentoTile
          title="Kart"
          subtitle="Plassering i kart (valgfritt)"
          :col-span="2"
          :expanded-col-span="4"
          clickable
          :expanded="!!expandedTiles['map']"
          @click="toggleExpand('map')"
        >
          <div
            class="map-placeholder"
            :class="{ 'map-placeholder--expanded': expandedTiles['map'] }"
          >
            <div class="map-placeholder__pin" />
            <div class="map-placeholder__text">
              Kartvisning kan integreres her (Ambita kart / annen karttjeneste).
            </div>
          </div>
        </BentoTile>

        <!-- Heftelser: pant -->
        <BentoTile
          title="Pant"
          subtitle="Hvilke banker har sikkerhet?"
          :col-span="1"
          :expanded-col-span="2"
          clickable
          :expanded="!!expandedTiles['mortgages']"
          @click="toggleExpand('mortgages')"
        >
          <ListWidget title="Pant" :items="data.mortgages" />
        </BentoTile>

        <!-- Heftelser: servitutter -->
        <BentoTile
          title="Servitutter"
          subtitle="Veirett, vannrett m.m."
          :col-span="1"
          :expanded-col-span="2"
          clickable
          :expanded="!!expandedTiles['easements']"
          @click="toggleExpand('easements')"
        >
          <ListWidget title="Servitutter" :items="data.easements" />
        </BentoTile>

        <!-- Siste aktivitet i grunnboken -->
        <BentoTile
          title="Aktivitet i grunnboken"
          subtitle="De viktigste hendelsene knyttet til eiendommen"
          :col-span="2"
          :expanded-col-span="3"
          clickable
          :expanded="!!expandedTiles['activity']"
          @click="toggleExpand('activity')"
        >
          <ActivityWidget :activities="data.activities" />
        </BentoTile>
      </BentoGrid>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard-page__header h1 {
  margin: 0 0 0.4rem;
  font-size: 1.6rem;
}

.dashboard-page__header p {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  max-width: 52rem;
}

.dashboard-page__state {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.72);
}

.dashboard-page__state--error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
  color: rgba(254, 202, 202, 0.95);
}

.dashboard-page__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.headline-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

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
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.88);
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
}

.search-row__input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.search-row__input:focus {
  border-color: rgba(var(--accent-rgb), 0.6);
  box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
  background: rgba(0, 0, 0, 0.35);
}

.search-feedback {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.62);
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
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.25);
  color: inherit;
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
  background: rgba(var(--accent-rgb), 0.15);
}

.search-results__address {
  font-weight: 600;
}

.search-results__meta {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
}

.map-placeholder {
  height: 100%;
  min-height: 220px;
  border-radius: 0.9rem;
  border: 1px dashed rgba(var(--accent-rgb), 0.35);
  background:
    radial-gradient(600px 260px at 50% 0%, rgba(var(--accent-rgb), 0.12), transparent 60%),
    rgba(0, 0, 0, 0.18);
  display: grid;
  place-items: center;
  gap: 0.5rem;
  padding: 1rem;
  transition: min-height 220ms ease, border-color 160ms ease, box-shadow 160ms ease;
}

.map-placeholder--expanded {
  min-height: 360px;
  border-color: rgba(var(--accent-rgb), 0.6);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.map-placeholder__pin {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: rgba(var(--accent-rgb), 0.95);
  box-shadow: 0 0 0 6px rgba(var(--accent-rgb), 0.18);
}

.map-placeholder__text {
  color: rgba(255, 255, 255, 0.68);
  text-align: center;
  max-width: 36rem;
}
</style>
