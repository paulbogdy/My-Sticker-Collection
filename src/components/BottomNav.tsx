import { ListChecks, Plus, Upload } from 'lucide-react'
import type { Screen } from '../types'

type BottomNavProps = {
  screen: Screen
  onSelect: (screen: Screen) => void
}

export function BottomNav({ screen, onSelect }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <button className={screen === 'collection' ? 'active' : ''} onClick={() => onSelect('collection')} type="button">
        <ListChecks size={19} />
        <span>Collection</span>
      </button>
      <button className={screen === 'duplicates' ? 'active' : ''} onClick={() => onSelect('duplicates')} type="button">
        <Plus size={19} />
        <span>Duplicates</span>
      </button>
      <button className={screen === 'sync' ? 'active' : ''} onClick={() => onSelect('sync')} type="button">
        <Upload size={19} />
        <span>Sync</span>
      </button>
    </nav>
  )
}
