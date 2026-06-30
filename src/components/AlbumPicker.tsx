import { Trophy } from 'lucide-react'
import type { Album } from '../types'

type AlbumPickerProps = {
  albums: Album[]
  selectedAlbumId: string
  onSelect: (albumId: string) => void
}

export function AlbumPicker({ albums, selectedAlbumId, onSelect }: AlbumPickerProps) {
  return (
    <div className="album-picker" aria-label="Album">
      {albums.map((album) => (
        <button
          key={album.id}
          className={selectedAlbumId === album.id ? 'album-card active' : 'album-card'}
          onClick={() => onSelect(album.id)}
          style={{ '--album-surface': album.theme.surface } as React.CSSProperties}
          type="button"
        >
          <span className="album-mark">{album.theme.mark}</span>
          <span>
            <strong>{album.title}</strong>
            <small>{album.edition}</small>
          </span>
          <Trophy size={18} />
        </button>
      ))}
    </div>
  )
}
