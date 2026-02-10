import { onMounted, ref } from 'vue'
import type { PropertySearchResult } from '../models/property'
import type { PropertyDashboardData } from '../services/dashboardService'
import { fetchDashboardData } from '../services/dashboardService'

export function useDashboard() {
  const data = ref<PropertyDashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // load tar eiendom som parameter
  const load = async (property?: PropertySearchResult) => {
    if (!property) return // hvis ingen valgt, gjør ingenting
    loading.value = true
    error.value = null
    try {
      data.value = await fetchDashboardData() // her kan du filtrere basert på property.id hvis API støtter
    } catch (e) {
      error.value = 'Kunne ikke laste dashboard-data'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => load()) // laster ikke noe før eiendom valgt

  return {
    data,
    loading,
    error,
    reload: load
  }
}
