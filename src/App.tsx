import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  Copy,
  Download,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Upload,
} from 'lucide-react'
import './App.css'
import { albums, getAlbumStickers, type Album, type StickerGroup } from './data/albums'
import { db, makeInventoryId, type InventoryItem } from './lib/db'
import { formatStickerCodes, parseStickerCodes, repeatedCodes } from './lib/stickerText'

type FilterMode = 'all' | 'missing' | 'collection' | 'duplicates'
type ImportTarget = 'collection' | 'duplicates'

const now = () => new Date().toISOString()

const emptyItem = (albumId: string, code: string): InventoryItem => ({
  id: makeInventoryId(albumId, code),
  albumId,
  code,
  collectionQty: 0,
  duplicateQty: 0,
  note: '',
  updatedAt: now(),
})

const orderedAlbumCodes = (seedCodes: string[], items: Record<string, InventoryItem>) => [
  ...seedCodes,
  ...Object.keys(items)
    .filter((code) => !seedCodes.includes(code))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
]

function App() {
  const [albumId, setAlbumId] = useState(albums[0].id)
  const album = albums.find((candidate) => candidate.id === albumId) ?? albums[0]
  const stickers = useMemo(() => getAlbumStickers(album), [album])
  const stickerCodes = useMemo(() => new Set(stickers.map((sticker) => sticker.code)), [stickers])
  const [items, setItems] = useState<Record<string, InventoryItem>>({})
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [importText, setImportText] = useState('')
  const [importTarget, setImportTarget] = useState<ImportTarget>('collection')
  const [message, setMessage] = useState('Ready')

  useEffect(() => {
    let mounted = true
    db.inventory.where('albumId').equals(album.id).toArray().then((rows) => {
      if (!mounted) return
      setItems(Object.fromEntries(rows.map((item) => [item.code, item])))
    })
    return () => {
      mounted = false
    }
  }, [album.id])

  const stats = useMemo(() => {
    const allCodes = Array.from(new Set([...stickers.map((sticker) => sticker.code), ...Object.keys(items)]))
    const collection = allCodes.filter((code) => (items[code]?.collectionQty ?? 0) > 0).length
    const duplicateKinds = allCodes.filter((code) => (items[code]?.duplicateQty ?? 0) > 0).length
    const duplicateTotal = allCodes.reduce(
      (total, code) => total + (items[code]?.duplicateQty ?? 0),
      0,
    )
    return {
      collection,
      missing: stickers.filter((sticker) => (items[sticker.code]?.collectionQty ?? 0) === 0).length,
      duplicateKinds,
      duplicateTotal,
      seeded: stickers.length,
    }
  }, [items, stickers])

  const updateItem = async (code: string, patch: Partial<InventoryItem>) => {
    const current = items[code] ?? emptyItem(album.id, code)
    const next = {
      ...current,
      ...patch,
      collectionQty: Math.max(0, patch.collectionQty ?? current.collectionQty),
      duplicateQty: Math.max(0, patch.duplicateQty ?? current.duplicateQty),
      updatedAt: now(),
    }
    setItems((previous) => ({ ...previous, [code]: next }))
    await db.inventory.put(next)
  }

  const setCollection = (code: string, owned: boolean) =>
    updateItem(code, { collectionQty: owned ? 1 : 0 })

  const changeDuplicate = (code: string, delta: number) => {
    const current = items[code] ?? emptyItem(album.id, code)
    return updateItem(code, { duplicateQty: current.duplicateQty + delta })
  }

  const visibleGroups = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase()
    const matchesSticker = (code: string) => {
      const item = items[code]
      const collectionQty = item?.collectionQty ?? 0
      const duplicateQty = item?.duplicateQty ?? 0
      if (normalizedQuery && !code.includes(normalizedQuery)) return false
      if (filter === 'missing') return collectionQty === 0
      if (filter === 'collection') return collectionQty > 0
      if (filter === 'duplicates') return duplicateQty > 0
      return true
    }

    return album.groups
      .map((group) => ({
        ...group,
        stickers: group.stickers.filter((sticker) => matchesSticker(sticker.code)),
      }))
      .filter((group) => group.stickers.length > 0)
      .concat(
        (() => {
          const imported = Object.keys(items)
            .filter((code) => !stickerCodes.has(code))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
            .filter(matchesSticker)
            .map((code) => ({ code }))

          return imported.length
            ? [
                {
                  id: 'imported-unlisted',
                  title: 'Imported / unlisted',
                  subtitle: 'Codes found in your data but not in the current seed yet',
                  stickers: imported,
                },
              ]
            : []
        })(),
      )
  }, [album.groups, filter, items, query, stickerCodes])

  const importCodes = async () => {
    const codes = parseStickerCodes(importText)
    if (codes.length === 0) {
      setMessage('Paste comma-separated codes first.')
      return
    }

    const counts = codes.reduce<Record<string, number>>((accumulator, code) => {
      accumulator[code] = (accumulator[code] ?? 0) + 1
      return accumulator
    }, {})

    await Promise.all(
      Object.entries(counts).map(([code, count]) => {
        const current = items[code] ?? emptyItem(album.id, code)
        if (importTarget === 'collection') {
          return updateItem(code, { collectionQty: 1 })
        }
        return updateItem(code, { duplicateQty: current.duplicateQty + count })
      }),
    )

    setMessage(
      `Imported ${codes.length} ${importTarget} codes.`,
    )
  }

  const exportCollection = () => {
    const orderedCodes = orderedAlbumCodes(stickers.map((sticker) => sticker.code), items)
    const codes = orderedCodes.filter((code) => (items[code]?.collectionQty ?? 0) > 0)
    return formatStickerCodes(codes)
  }

  const exportDuplicates = () => {
    const entries = orderedAlbumCodes(stickers.map((sticker) => sticker.code), items).map((code) => ({
      code,
      qty: items[code]?.duplicateQty ?? 0,
    }))
    return formatStickerCodes(repeatedCodes(entries))
  }

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setMessage(`${label} copied.`)
  }

  const downloadBackup = () => {
    const payload = {
      version: 1,
      exportedAt: now(),
      albums: albums.map((candidate) => ({ id: candidate.id, title: candidate.title })),
      inventory: Object.values(items),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${album.id}-backup.json`
    anchor.click()
    URL.revokeObjectURL(url)
    setMessage('Backup downloaded.')
  }

  const resetAlbum = async () => {
    const confirmed = window.confirm(`Clear local data for ${album.title}?`)
    if (!confirmed) return
    await db.inventory.where('albumId').equals(album.id).delete()
    setItems({})
    setMessage('Album data cleared.')
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Local-first PWA</p>
          <h1>My Sticker Collection</h1>
          <p className="hero-copy">{album.title} - {album.edition}</p>
        </div>
        <select value={albumId} onChange={(event) => setAlbumId(event.target.value)} aria-label="Album">
          {albums.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.title}
            </option>
          ))}
        </select>
      </header>

      <section className="stats-grid" aria-label="Album stats">
        <Stat label="In collection" value={stats.collection} />
        <Stat label="Missing" value={stats.missing} />
        <Stat label="Duplicate types" value={stats.duplicateKinds} />
        <Stat label="Dupes total" value={stats.duplicateTotal} />
      </section>

      <section className="toolbar" aria-label="Sticker filters">
        <label className="search-box">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search MEX11, SUI, FWC..."
            type="search"
          />
        </label>
        <div className="segments" role="tablist" aria-label="Filter">
          {(['all', 'missing', 'collection', 'duplicates'] as const).map((mode) => (
            <button
              key={mode}
              className={filter === mode ? 'active' : ''}
              onClick={() => setFilter(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      <section className="sync-panel" aria-label="Import and export">
        <div className="panel-title">
          <Upload size={19} />
          <h2>LastSticker import/export</h2>
        </div>
        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Paste comma-separated codes: MEX11, SUI20, FWC1"
          rows={3}
        />
        <div className="sync-actions">
          <select
            value={importTarget}
            onChange={(event) => setImportTarget(event.target.value as ImportTarget)}
            aria-label="Import target"
          >
            <option value="collection">Import into collection</option>
            <option value="duplicates">Import into duplicates</option>
          </select>
          <button type="button" onClick={importCodes}>
            <Upload size={17} /> Import
          </button>
        </div>
        <div className="sync-actions">
          <button type="button" onClick={() => copyText(exportCollection(), 'Collection export')}>
            <Copy size={17} /> Copy collection
          </button>
          <button type="button" onClick={() => copyText(exportDuplicates(), 'Duplicates export')}>
            <Copy size={17} /> Copy duplicates
          </button>
        </div>
        <div className="sync-actions">
          <button type="button" onClick={downloadBackup}>
            <Download size={17} /> Backup
          </button>
          <button className="danger" type="button" onClick={resetAlbum}>
            <RotateCcw size={17} /> Reset
          </button>
        </div>
        <p className="status-line">{message}</p>
      </section>

      <section className="album-note">
        Seeded stickers: {stats.seeded} / LastSticker total: {album.expectedTotal}. {album.source}
      </section>

      <section className="groups" aria-label="Sticker groups">
        {visibleGroups.map((group) => (
          <StickerSection
            key={group.id}
            album={album}
            group={group}
            items={items}
            onCollection={setCollection}
            onDuplicate={changeDuplicate}
          />
        ))}
      </section>
    </main>
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

function StickerSection({
  album,
  group,
  items,
  onCollection,
  onDuplicate,
}: {
  album: Album
  group: StickerGroup
  items: Record<string, InventoryItem>
  onCollection: (code: string, owned: boolean) => void
  onDuplicate: (code: string, delta: number) => void
}) {
  const collected = group.stickers.filter((sticker) => (items[sticker.code]?.collectionQty ?? 0) > 0).length
  return (
    <article className="group-block">
      <header>
        <div>
          <h2>{group.title}</h2>
          {group.subtitle ? <p>{group.subtitle}</p> : null}
        </div>
        <span>
          {collected}/{group.stickers.length}
        </span>
      </header>
      <div className="sticker-grid">
        {group.stickers.map((sticker) => {
          const item = items[sticker.code] ?? emptyItem(album.id, sticker.code)
          const owned = item.collectionQty > 0
          return (
            <div className={`sticker-tile ${owned ? 'owned' : ''}`} key={sticker.code}>
              <button
                className="owned-toggle"
                type="button"
                onClick={() => onCollection(sticker.code, !owned)}
                aria-label={`${owned ? 'Remove' : 'Add'} ${sticker.code} from collection`}
              >
                <span>{sticker.code}</span>
                {owned ? <Check size={18} /> : null}
              </button>
              <div className="dupe-stepper" aria-label={`${sticker.code} duplicates`}>
                <button type="button" onClick={() => onDuplicate(sticker.code, -1)} aria-label="Remove duplicate">
                  <Minus size={16} />
                </button>
                <strong>{item.duplicateQty}</strong>
                <button type="button" onClick={() => onDuplicate(sticker.code, 1)} aria-label="Add duplicate">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default App
