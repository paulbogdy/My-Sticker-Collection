import { Handshake, Layers, ListChecks, Upload } from 'lucide-react'
import type { Screen } from '../types'

type BottomNavProps = {
  screen: Screen
  onSelect: (screen: Screen) => void
}

export function BottomNav({ screen, onSelect }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <button
        aria-label="Collection"
        className={screen === 'collection' ? 'active' : ''}
        onClick={() => onSelect('collection')}
        title="Collection"
        type="button"
      >
        <ListChecks size={22} />
      </button>
      <button
        aria-label="Duplicates"
        className={screen === 'duplicates' ? 'active' : ''}
        onClick={() => onSelect('duplicates')}
        title="Duplicates"
        type="button"
      >
        <Layers size={22} />
      </button>
      <button
        aria-label="Trades"
        className={screen === 'trades' ? 'active' : ''}
        onClick={() => onSelect('trades')}
        title="Trades"
        type="button"
      >
        <Handshake size={22} />
      </button>
      <button
        aria-label="Sync"
        className={screen === 'sync' ? 'active' : ''}
        onClick={() => onSelect('sync')}
        title="Sync"
        type="button"
      >
        <Upload size={22} />
      </button>
    </nav>
  )
}
