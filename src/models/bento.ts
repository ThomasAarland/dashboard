export interface BentoTileModel {
  id: string
  title: string
  subtitle?: string
  colSpan?: number
  rowSpan?: number
}

export interface BentoGridModel {
  tiles: BentoTileModel[]
}

