import Dexie, { type EntityTable } from 'dexie'

export type InventoryItem = {
  id: string
  albumId: string
  code: string
  collectionQty: number
  duplicateQty: number
  note: string
  updatedAt: string
}

class StickerDatabase extends Dexie {
  inventory!: EntityTable<InventoryItem, 'id'>

  constructor() {
    super('my-sticker-collection')
    this.version(1).stores({
      inventory: 'id, albumId, code, updatedAt',
    })
  }
}

export const db = new StickerDatabase()

export const makeInventoryId = (albumId: string, code: string) => `${albumId}:${code}`
