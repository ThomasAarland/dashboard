import { onMounted, ref } from 'vue'
import type { PropertyDashboardData } from '../services/dashboardService'
import { fetchDashboardData } from '../services/dashboardService'

// Encapsulates loading/error lifecycle for the dashboard mock API.

export function useDashboard() {
  const data = ref<PropertyDashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      data.value = await fetchDashboardData()
    } catch (e) {
      error.value = 'Kunne ikke laste dashboard-data'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return {
    data,
    loading,
    error,
    reload: load
  }
}
