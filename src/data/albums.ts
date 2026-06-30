import type { Album, Sticker } from '../types'
import { worldCup2026 } from './worldCup2026'

export const albums: Album[] = [worldCup2026]

export const getAlbumStickers = (album: Album): Sticker[] =>
  album.groups.flatMap((group) => group.stickers)
