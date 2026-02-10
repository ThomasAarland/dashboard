export interface StatSummary {
  id: string
  label: string
  value?: string
  trend?: string
  details?: { owner: string; value: number }[] // For DoughnutChart
}

export interface ActivityEntry {
  id: string | number
  time: string
  text: string
}

export interface SimpleItem {
  id: string | number
  label: string
}

export interface PropertyDashboardData {
  headlineStats: StatSummary[]
  basicData: SimpleItem[]
  buildings: SimpleItem[]
  ownershipShares: SimpleItem[]
  location: SimpleItem[]
  mortgages: SimpleItem[]
  easements: SimpleItem[]
  activities: ActivityEntry[]
}

export function fetchDashboardData(): Promise<PropertyDashboardData> {
  return Promise.resolve({
    headlineStats: [
      {
        id: 'area',
        label: 'Tomteareal',
        value: '750 m²',
        details: [
          { owner: 'Ola Nordmann', value: 50 },
          { owner: 'Kari Nordmann', value: 30 },
          { owner: 'Per Hansen', value: 20 }
        ]
      },
      {
        id: 'buildings',
        label: 'Bygninger',
        value: '2',
        details: [
          { owner: 'Hovedbygning', value: 70 },
          { owner: 'Garasje', value: 30 }
        ]
      },
      {
        id: 'owners',
        label: 'Antall eiere',
        value: '3',
        details: [
          { owner: 'Ola Nordmann', value: 50 },
          { owner: 'Kari Nordmann', value: 25 },
          { owner: 'Per Hansen', value: 25 }
        ]
      }
    ],
    basicData: [
      { id: 'matrikkel', label: 'Gnr/Bnr: 12/345' },
      { id: 'propertyType', label: 'Type: Enebolig med tomt' },
      { id: 'usage', label: 'Bruksformål: Bolig' },
      { id: 'area', label: 'Tomteareal: 750 m²' }
    ],
    buildings: [
      { id: 'main', label: 'Hovedbygning: 180 m² BRA, oppført 1987' },
      { id: 'garage', label: 'Garasje: 36 m² BRA, oppført 1995' }
    ],
    ownershipShares: [
      { id: 'owner1', label: 'Ola Nordmann – 50 %' },
      { id: 'owner2', label: 'Kari Nordmann – 25 %' },
      { id: 'owner3', label: 'Per Hansen – 25 %' }
    ],
    location: [
      { id: 'address', label: 'Adresse: Eksempelveien 10' },
      { id: 'municipality', label: 'Kommune: Oslo' },
      { id: 'district', label: 'Krets: Nordre Aker' },
      { id: 'map', label: 'Kartplassering: Klikk for å åpne kart (valgfritt)' }
    ],
    mortgages: [
      { id: 'mortgage1', label: 'Boliglån – DNB Bank ASA' },
      { id: 'mortgage2', label: 'Topplån – SpareBank 1' }
    ],
    easements: [
      { id: 'easement1', label: 'Veirett over naboeiendom' },
      { id: 'easement2', label: 'Rett til vann og avløp' }
    ],
    activities: [
      { id: 1, time: '2024-08-15', text: 'Tinglyst nytt pantedokument – DNB Bank ASA' },
      { id: 2, time: '2022-03-01', text: 'Tinglyst overdragelse – eierendring' },
      { id: 3, time: '2018-11-30', text: 'Tinglyst veirett til fordel for eiendommen' }
    ]
  })
}
