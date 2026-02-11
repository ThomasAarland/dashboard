// Optional model contracts for driving the grid from config if needed later.
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
