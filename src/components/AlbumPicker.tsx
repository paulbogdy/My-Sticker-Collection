import { Trophy } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Album } from '../types'

type AlbumPickerProps = {
  albums: Album[]
  selectedAlbumId: string
  onSelect: (albumId: string) => void
}

export function AlbumPicker({ albums, selectedAlbumId, onSelect }: AlbumPickerProps) {
  return (
    <section className="album-screen" aria-label="Album">
      <div className="screen-heading">
        <h2>Albums</h2>
      </div>
      <div className="album-picker">
        {albums.map((album) => (
          <button
            key={album.id}
            className={selectedAlbumId === album.id ? 'album-card active' : 'album-card'}
            onClick={() => onSelect(album.id)}
            style={{ '--album-surface': album.theme.surface } as CSSProperties}
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
    </section>
  )
}
