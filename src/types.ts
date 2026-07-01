import type { InventoryItem } from './lib/db'

export type WorkMode = 'collection' | 'duplicates'

export type SyncImportMode = 'missing' | 'spares'

export type Screen = WorkMode | 'trades' | 'sync' | 'albums'

export type FilterMode = 'all' | 'missing' | 'owned' | 'duplicates'

export type Sticker = {
  code: string
  label?: string
  flag?: string
  flagImage?: string
  mark?: string
  tone?: 'team' | 'intro' | 'history' | 'sponsor'
  accentColors?: string[]
}

export type StickerGroup = {
  id: string
  title: string
  subtitle?: string
  flagImages?: Array<{
    src: string
    alt: string
  }>
  stickers: Sticker[]
}

export type AlbumTheme = {
  mark: string
  surface: string
  progress: string
}

export type Album = {
  id: string
  title: string
  edition: string
  source: string
  expectedTotal?: number
  theme: AlbumTheme
  groups: StickerGroup[]
}

export type AlbumStats = {
  collection: number
  missing: number
  duplicateKinds: number
  duplicateTotal: number
  seeded: number
}

export type InventoryByCode = Record<string, InventoryItem>
