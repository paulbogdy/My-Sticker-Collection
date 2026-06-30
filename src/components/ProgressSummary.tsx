import type { Album, AlbumStats } from '../types'

type ProgressSummaryProps = {
  album: Album
  stats: AlbumStats
}

export function ProgressSummary({ album, stats }: ProgressSummaryProps) {
  const progressPercent = stats.seeded ? Math.round((stats.collection / stats.seeded) * 100) : 0

  return (
    <section
      className="progress-card"
      aria-label="Album progress"
      style={{ '--album-surface': album.theme.surface, '--album-progress': album.theme.progress } as React.CSSProperties}
    >
      <div>
        <p className="eyebrow">{album.edition}</p>
        <h1>{album.title}</h1>
        <p>{stats.collection} of {stats.seeded} stickers collected</p>
      </div>
      <strong>{progressPercent}%</strong>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${progressPercent}%` }} />
      </div>
    </section>
  )
}
