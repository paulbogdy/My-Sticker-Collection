import type { AlbumStats } from '../types'

export function QuickStats({ stats }: { stats: AlbumStats }) {
  return (
    <section className="quick-stats" aria-label="Album stats">
      <Stat label="Missing" value={stats.missing} />
      <Stat label="Dupe types" value={stats.duplicateKinds} />
      <Stat label="Dupes total" value={stats.duplicateTotal} />
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
