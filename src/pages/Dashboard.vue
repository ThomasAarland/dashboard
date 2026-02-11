
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BentoGrid from '../components/bento/BentoGrid.vue'
import AccessSearchTile from '../components/dashboard/AccessSearchTile.vue'
import ActivityTile from '../components/dashboard/ActivityTile.vue'
import DataListTile from '../components/dashboard/DataListTile.vue'
import HeadlineStatTile from '../components/dashboard/HeadlineStatTile.vue'
import MapTile from '../components/dashboard/MapTile.vue'
import { useDashboard } from '../composables/useDashboard'
import type { PropertySearchResult } from '../models/property'
import type { StatSummary } from '../services/dashboardService'

const { data, loading, error, reload } = useDashboard()

const headlineStats = computed(() => data.value?.headlineStats ?? [])
const basicIdentity = computed(() => data.value?.basicData.slice(0, 2) ?? [])
const basicArea = computed(() => data.value?.basicData.slice(2) ?? [])
const buildings = computed(() => data.value?.buildings ?? [])
const primaryOwners = computed(() => data.value?.ownershipShares.slice(0, 2) ?? [])
const secondaryOwners = computed(() => data.value?.ownershipShares.slice(2) ?? [])
const locationItems = computed(() => data.value?.location ?? [])
const mortgages = computed(() => data.value?.mortgages ?? [])
const easements = computed(() => data.value?.easements ?? [])
const activities = computed(() => data.value?.activities ?? [])

const buildingCount = computed(() => buildings.value.length)
const ownerCount = computed(() => (data.value?.ownershipShares.length ?? 0))

const expandedTiles = reactive<Record<string, boolean>>({})
const selectedProperty = ref<PropertySearchResult | null>(null)
const hasSelectedProperty = computed(() => !!selectedProperty.value)

// Quick lookup map so individual sections can grab the exact stat they need
const statsById = computed<Record<string, StatSummary | undefined>>(() => {
  const map: Record<string, StatSummary | undefined> = {}
  headlineStats.value.forEach((stat) => {
    map[stat.id] = stat
  })
  return map
})

const areaStat = computed(() => statsById.value['area'])
const buildingStat = computed(() => statsById.value['buildings'])
const ownerCountStat = computed(() => statsById.value['owners'])

const toggleExpand = (id: string) => {
  expandedTiles[id] = !expandedTiles[id]
}

const handlePropertySelected = (property: PropertySearchResult) => {
  selectedProperty.value = property
  reload()
}
</script>


<template>
  <main class="dashboard-page">
    <header class="dashboard-page__header">
      <div>
        <h1>Eiendomsportalen</h1>
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
        <!-- Rad 1: søk/tilgangsinformasjon -->
        <div class="dashboard-row dashboard-row--search">
          <AccessSearchTile @property-selected="handlePropertySelected" />
        </div>

        <template v-if="hasSelectedProperty">
          <!-- Rad 2: tomteinfo, areal og identifikasjon -->
          <div class="dashboard-row dashboard-row--line">
            <HeadlineStatTile v-if="areaStat" :stat="areaStat" />
            <DataListTile
              title="Areal og bruk"
              subtitle="Størrelse og formål"
              list-title="Arealinformasjon"
              :items="basicArea"
              :expanded="!!expandedTiles['basicArea']"
              @toggle="toggleExpand('basicArea')"
            />
            <DataListTile
              title="Identifikasjon"
              subtitle="Gnr/Bnr og type"
              list-title="Basisopplysninger"
              :items="basicIdentity"
              :expanded="!!expandedTiles['basicIdentity']"
              @toggle="toggleExpand('basicIdentity')"
            />
          </div>

          <!-- Rad 3: eiere + antall eiere -->
          <div class="dashboard-row dashboard-row--owners">
            <DataListTile
              title="Hovedeiere"
              subtitle="Største andeler"
              list-title="Hovedandeler"
              :items="primaryOwners"
              :meta-text="`${ownerCount} registrerte eiere`"
              :col-span="1"
              :expanded-col-span="1"
              :expanded="!!expandedTiles['primaryOwners']"
              @toggle="toggleExpand('primaryOwners')"
            />
            <DataListTile
              title="Øvrige eiere"
              subtitle="Resterende andeler"
              list-title="Øvrige andeler"
              :items="secondaryOwners"
              :meta-text="`${secondaryOwners.length} øvrige eiere`"
              :col-span="1"
              :expanded-col-span="1"
              :expanded="false"
              :clickable="false"
            />
            <HeadlineStatTile v-if="ownerCountStat" :stat="ownerCountStat" />
          </div>

          <!-- Rad 4: bygninger og lokasjon -->
          <div class="dashboard-row dashboard-row--buildings">
            <HeadlineStatTile v-if="buildingStat" :stat="buildingStat" />
            <DataListTile
              title="Bygninger tilknyttet eiendommen"
              list-title="Bygninger"
              :items="buildings"
              :meta-text="`${buildingCount} registrerte bygninger`"
              :expanded="!!expandedTiles['buildings']"
              @toggle="toggleExpand('buildings')"
            />
            <DataListTile
              title="Eiendommens beliggenhet"
              list-title="Adresse, kommune, krets"
              :items="locationItems"
              :expanded="!!expandedTiles['location']"
              @toggle="toggleExpand('location')"
            />
          </div>

          <!-- Rad 5: kart -->
          <div class="dashboard-row dashboard-row--map">
            <MapTile :expanded="true" />
          </div>

          <!-- Rad 6: pant, aktivitet og servitutter -->
          <div class="dashboard-row dashboard-row--legal">
            <DataListTile
              title="Pant"
              subtitle="Hvilke banker har sikkerhet?"
              list-title="Pant"
              :items="mortgages"
              :expanded="!!expandedTiles['mortgages']"
              @toggle="toggleExpand('mortgages')"
            />
            <div class="dashboard-row__activity">
              <ActivityTile
                :activities="activities"
                :expanded="!!expandedTiles['activity']"
                @toggle="toggleExpand('activity')"
              />
            </div>
            <DataListTile
              title="Servitutter"
              subtitle="Veirett, vannrett m.m."
              list-title="Servitutter"
              :items="easements"
              :expanded="!!expandedTiles['easements']"
              @toggle="toggleExpand('easements')"
            />
          </div>
        </template>

        <template v-else>
          <div class="dashboard-row dashboard-row--placeholder">
            <div class="dashboard-page__placeholder">
              Velg en eiendom i søkefeltet for å se detaljer, kart og aktivitetslogg.
            </div>
          </div>
        </template>
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
  color: var(--muted);
  max-width: 52rem;
}

.dashboard-page__state {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(var(--accent-rgb), 0.06);
  border: 1px solid rgba(var(--accent-rgb), 0.2);
  color: var(--text);
}

.dashboard-page__state--error {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.3);
  color: #a11a2b;
}

.dashboard-page__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Felles rad-oppsett slik at hver seksjon kan ha egne kolonner */
.dashboard-row {
  grid-column: 1 / -1;
  display: grid;
  gap: 1rem;
}

.dashboard-row--search,
.dashboard-row--map,
.dashboard-row--placeholder {
  grid-template-columns: minmax(0, 1fr);
}

.dashboard-row--line {
  grid-template-columns:
    minmax(0, 0.8fr)
    minmax(0, 1.1fr)
    minmax(0, 1.2fr);
}

.dashboard-row--owners {
  grid-template-columns:
    minmax(0, 3fr)
    minmax(0, 3fr)
    minmax(0, 2fr);
  align-items: stretch;
}

.dashboard-row--buildings {
  grid-template-columns:
    minmax(0, 0.8fr)
    minmax(0, 1.1fr)
    minmax(0, 1.2fr);
}

.dashboard-row--legal {
  grid-template-columns:
    minmax(0, 0.8fr)
    minmax(0, 1.4fr)
    minmax(0, 1fr);
  align-items: stretch;
}

.dashboard-row__activity {
  max-width: 520px;
  width: 100%;
  justify-self: stretch;
}

.dashboard-page__placeholder {
  grid-column: 1 / -1;
  min-height: 220px;
  border-radius: 1rem;
  border: 1px dashed rgba(var(--accent-rgb), 0.35);
  color: var(--muted);
  display: grid;
  place-items: center;
  padding: 1.5rem;
  text-align: center;
  background: rgba(var(--accent-rgb), 0.04);
}
</style>

