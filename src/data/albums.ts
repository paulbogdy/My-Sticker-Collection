import type { Album, Sticker } from '../types'
import { euro2024 } from './euro2024'
import { worldCup2022 } from './worldCup2022'
import { worldCup2026 } from './worldCup2026'

export const albums: Album[] = [worldCup2026, euro2024, worldCup2022]

export const getAlbumStickers = (album: Album): Sticker[] =>
  album.groups.flatMap((group) => group.stickers)
