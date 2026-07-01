import Dexie, { type EntityTable } from 'dexie'

export type InventoryItem = {
  id: string
  albumId: string
  code: string
  collectionQty: number
  duplicateQty: number
  sortOrder: number
  note: string
  updatedAt: string
}

export type TradeStatus = 'pending' | 'completed'

export type TradeItem = {
  code: string
  qty: number
}

export type Trade = {
  id: string
  albumId: string
  partner: string
  outgoing: TradeItem[]
  incoming: TradeItem[]
  status: TradeStatus
  createdAt: string
  updatedAt: string
  completedAt?: string
}

class StickerDatabase extends Dexie {
  inventory!: EntityTable<InventoryItem, 'id'>
  trades!: EntityTable<Trade, 'id'>

  constructor() {
    super('my-sticker-collection')
    this.version(1).stores({
      inventory: 'id, albumId, code, updatedAt',
    })
    this.version(2).stores({
      inventory: 'id, albumId, code, sortOrder, updatedAt',
    })
    this.version(3).stores({
      inventory: 'id, albumId, code, sortOrder, updatedAt',
      trades: 'id, albumId, status, updatedAt',
    })
  }
}

export const db = new StickerDatabase()

export const makeInventoryId = (albumId: string, code: string) => `${albumId}:${code}`
