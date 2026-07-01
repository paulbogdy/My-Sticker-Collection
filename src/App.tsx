import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ChevronDown,
  Sticker,
} from 'lucide-react'
import './App.css'
import { AlbumPicker } from './components/AlbumPicker'
import { BottomNav } from './components/BottomNav'
import { ProgressSummary } from './components/ProgressSummary'
import { QuickStats } from './components/Stats'
import { StickerSection } from './components/StickerSection'
import { SyncScreen } from './components/SyncScreen'
import { TradesScreen } from './components/TradesScreen'
import { albums, getAlbumStickers } from './data/albums'
import { db, makeInventoryId, type InventoryItem, type Trade, type TradeItem } from './lib/db'
import { formatStickerCodes, formatStickerQuantities, parseStickerCodes } from './lib/stickerText'
import type { AlbumStats, FilterMode, Screen, SyncImportMode, WorkMode } from './types'

const now = () => new Date().toISOString()

const emptyItem = (albumId: string, code: string): InventoryItem => ({
  id: makeInventoryId(albumId, code),
  albumId,
  code,
  collectionQty: 0,
  duplicateQty: 0,
  sortOrder: Number.MAX_SAFE_INTEGER,
  note: '',
  updatedAt: now(),
})

const tradeItemsFromCodes = (codes: string[]): TradeItem[] => {
  const counts = codes.reduce<Record<string, number>>((accumulator, code) => {
    accumulator[code] = (accumulator[code] ?? 0) + 1
    return accumulator
  }, {})
  return Object.entries(counts).map(([code, qty]) => ({ code, qty }))
}

function App() {
  const [albumId, setAlbumId] = useState(albums[0].id)
  const album = albums.find((candidate) => candidate.id === albumId) ?? albums[0]
  const stickers = useMemo(() => getAlbumStickers(album), [album])
  const stickerCodes = useMemo(() => new Set(stickers.map((sticker) => sticker.code)), [stickers])
  const [items, setItems] = useState<Record<string, InventoryItem>>({})
  const [trades, setTrades] = useState<Trade[]>([])
  const [workMode, setWorkMode] = useState<WorkMode>('collection')
  const [syncImportMode, setSyncImportMode] = useState<SyncImportMode>('missing')
  const [screen, setScreen] = useState<Screen>('collection')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [importText, setImportText] = useState('')
  const [message, setMessage] = useState('Ready')
  const [tradeDraft, setTradeDraft] = useState({
    partner: '',
    outgoingText: '',
    incomingText: '',
  })
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set())
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    let mounted = true
    db.inventory.where('albumId').equals(album.id).toArray().then((rows) => {
      if (!mounted) return
      const knownRows = rows.filter((item) => stickerCodes.has(item.code))
      const staleRows = rows.filter((item) => !stickerCodes.has(item.code))

      if (staleRows.length > 0) {
        db.inventory.bulkDelete(staleRows.map((item) => item.id))
      }

      setItems(Object.fromEntries(knownRows.map((item) => [item.code, item])))
    })
    return () => {
      mounted = false
    }
  }, [album.id, stickerCodes])

  useEffect(() => {
    let mounted = true
    db.trades.where('albumId').equals(album.id).toArray().then((rows) => {
      if (!mounted) return
      setTrades(rows.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)))
    })
    return () => {
      mounted = false
    }
  }, [album.id])

  useEffect(() => {
    setExpandedGroups(new Set())
    setExpandedTeams(new Set())
  }, [album.id])

  const stats = useMemo<AlbumStats>(() => {
    const collection = stickers.filter((sticker) => (items[sticker.code]?.collectionQty ?? 0) > 0).length
    const duplicateKinds = stickers.filter((sticker) => (items[sticker.code]?.duplicateQty ?? 0) > 0).length
    const duplicateTotal = stickers.reduce(
      (total, sticker) => total + (items[sticker.code]?.duplicateQty ?? 0),
      0,
    )
    return {
      collection,
      missing: stickers.length
        ? stickers.filter((sticker) => (items[sticker.code]?.collectionQty ?? 0) === 0).length
        : 0,
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
      sortOrder: patch.sortOrder ?? current.sortOrder,
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

  const upsertTrade = async (trade: Trade) => {
    await db.trades.put(trade)
    setTrades((previous) => {
      const withoutTrade = previous.filter((candidate) => candidate.id !== trade.id)
      return [trade, ...withoutTrade].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    })
  }

  const createTrade = async () => {
    const outgoingCodes = parseStickerCodes(tradeDraft.outgoingText).filter((code) => stickerCodes.has(code))
    const incomingCodes = parseStickerCodes(tradeDraft.incomingText).filter((code) => stickerCodes.has(code))
    const parsedOutgoingCount = parseStickerCodes(tradeDraft.outgoingText).length
    const parsedIncomingCount = parseStickerCodes(tradeDraft.incomingText).length
    const ignoredCount = parsedOutgoingCount + parsedIncomingCount - outgoingCodes.length - incomingCodes.length

    if (outgoingCodes.length === 0 && incomingCodes.length === 0) {
      setMessage('Paste at least one valid sticker code for the trade.')
      return
    }

    const timestamp = now()
    const trade: Trade = {
      id: `${album.id}:trade:${crypto.randomUUID()}`,
      albumId: album.id,
      partner: tradeDraft.partner.trim(),
      outgoing: tradeItemsFromCodes(outgoingCodes),
      incoming: tradeItemsFromCodes(incomingCodes),
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    await upsertTrade(trade)
    setTradeDraft({ partner: '', outgoingText: '', incomingText: '' })
    setMessage(`Pending trade saved${ignoredCount ? `; ignored ${ignoredCount} unknown codes` : ''}.`)
  }

  const completeTrade = async (trade: Trade) => {
    const outgoingTotal = trade.outgoing.reduce((total, item) => total + item.qty, 0)
    const incomingTotal = trade.incoming.reduce((total, item) => total + item.qty, 0)
    const confirmed = window.confirm(
      `Finalize this trade?\n\nThis will remove ${outgoingTotal} spare stickers and add ${incomingTotal} received stickers to your album.`,
    )
    if (!confirmed) return

    const nextItems = { ...items }
    trade.outgoing.forEach((tradeItem) => {
      const current = nextItems[tradeItem.code] ?? emptyItem(album.id, tradeItem.code)
      nextItems[tradeItem.code] = {
        ...current,
        duplicateQty: Math.max(0, current.duplicateQty - tradeItem.qty),
        updatedAt: now(),
      }
    })

    trade.incoming.forEach((tradeItem) => {
      const current = nextItems[tradeItem.code] ?? emptyItem(album.id, tradeItem.code)
      const fillsMissing = current.collectionQty === 0
      nextItems[tradeItem.code] = {
        ...current,
        collectionQty: 1,
        duplicateQty: current.duplicateQty + Math.max(0, tradeItem.qty - (fillsMissing ? 1 : 0)),
        updatedAt: now(),
      }
    })

    await db.inventory.bulkPut(Object.values(nextItems))
    setItems(nextItems)

    await upsertTrade({
      ...trade,
      status: 'completed',
      completedAt: now(),
      updatedAt: now(),
    })
    setMessage('Trade finalized and inventory updated.')
  }

  const cancelTrade = async (trade: Trade) => {
    const confirmed = window.confirm('Cancel this pending trade? Inventory will not change.')
    if (!confirmed) return
    await db.trades.delete(trade.id)
    setTrades((previous) => previous.filter((candidate) => candidate.id !== trade.id))
    setMessage('Trade cancelled. Inventory was not changed.')
  }

  const visibleGroups = useMemo(() => {
    const matchesSticker = (code: string) => {
      const item = items[code]
      const collectionQty = item?.collectionQty ?? 0
      const duplicateQty = item?.duplicateQty ?? 0
      if (filter === 'missing') return collectionQty === 0
      if (filter === 'owned') return collectionQty > 0
      if (filter === 'duplicates') return duplicateQty > 0
      return true
    }

    return album.groups
      .map((group) => ({
        ...group,
        stickers: group.stickers.filter((sticker) => matchesSticker(sticker.code)),
      }))
      .filter((group) => group.stickers.length > 0)
  }, [album.groups, filter, items])

  const importCodes = async () => {
    const codes = parseStickerCodes(importText)
    if (codes.length === 0) {
      setMessage('Paste comma-separated codes first.')
      return
    }

    const knownCodes = codes.filter((code) => stickerCodes.has(code))
    const ignoredCount = codes.length - knownCodes.length

    if (knownCodes.length === 0) {
      setMessage(`No matching album codes found${ignoredCount ? `; deleted ${ignoredCount} unknown codes.` : '.'}`)
      return
    }

    const counts = knownCodes.reduce<Record<string, number>>((accumulator, code) => {
      accumulator[code] = (accumulator[code] ?? 0) + 1
      return accumulator
    }, {})

    if (syncImportMode === 'missing') {
      const missingCodes = new Set(knownCodes)
      await Promise.all(
        stickers.map((sticker) => updateItem(sticker.code, { collectionQty: missingCodes.has(sticker.code) ? 0 : 1 })),
      )
      setMessage(
        `Imported ${knownCodes.length} missing codes${ignoredCount ? `, deleted ${ignoredCount} unknown` : ''}.`,
      )
      return
    }

    await Promise.all(
      stickers.map((sticker) => updateItem(sticker.code, { duplicateQty: counts[sticker.code] ?? 0 })),
    )

    setMessage(
      `Imported ${knownCodes.length} spare codes${ignoredCount ? `, deleted ${ignoredCount} unknown` : ''}.`,
    )
  }

  const exportMissing = () => {
    const codes = stickers
      .map((sticker) => sticker.code)
      .filter((code) => (items[code]?.collectionQty ?? 0) === 0)
    return formatStickerCodes(codes)
  }

  const exportSpares = () => {
    const entries = stickers.map((sticker) => ({
      code: sticker.code,
      qty: items[sticker.code]?.duplicateQty ?? 0,
    }))
    return formatStickerQuantities(entries)
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
      inventory: Object.values(items).filter((item) => stickerCodes.has(item.code)),
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

  const switchScreen = (nextScreen: Screen) => {
    setScreen(nextScreen)
    if (nextScreen === 'collection' || nextScreen === 'duplicates') {
      setWorkMode(nextScreen)
      setFilter('all')
    }
  }

  const selectAlbum = (nextAlbumId: string) => {
    setAlbumId(nextAlbumId)
    setScreen('collection')
    setWorkMode('collection')
    setFilter('all')
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((previous) => {
      const next = new Set(previous)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((previous) => {
      const next = new Set(previous)
      if (next.has(teamId)) {
        next.delete(teamId)
      } else {
        next.add(teamId)
      }
      return next
    })
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <button
          className="current-album-button"
          type="button"
          onClick={() => setScreen('albums')}
          style={{ '--album-surface': album.theme.surface } as CSSProperties}
        >
          <span className="album-mark">{album.theme.mark}</span>
          <span>
            <strong>{album.title}</strong>
            <small>{album.edition}</small>
          </span>
          <ChevronDown size={18} />
        </button>
      </header>

      {screen === 'albums' ? (
        <AlbumPicker albums={albums} selectedAlbumId={albumId} onSelect={selectAlbum} />
      ) : (
        <>
          <ProgressSummary album={album} stats={stats} />
          <QuickStats stats={stats} />

          {screen === 'sync' ? (
            <SyncScreen
              importText={importText}
              message={message}
              importMode={syncImportMode}
              setImportText={setImportText}
              setImportMode={setSyncImportMode}
              importCodes={importCodes}
              copyText={copyText}
              exportMissing={exportMissing}
              exportSpares={exportSpares}
              downloadBackup={downloadBackup}
              resetAlbum={resetAlbum}
            />
          ) : screen === 'trades' ? (
            <TradesScreen
              draft={tradeDraft}
              items={items}
              message={message}
              stickers={stickers}
              trades={trades}
              onDraftChange={setTradeDraft}
              onCreateTrade={createTrade}
              onCompleteTrade={completeTrade}
              onCancelTrade={cancelTrade}
            />
          ) : (
            <>
              <section className="toolbar" aria-label="Sticker filters">
                <div className="segments" role="tablist" aria-label="Filter">
                  {(workMode === 'collection'
                    ? (['all', 'missing', 'owned'] as const)
                    : (['all', 'duplicates'] as const)
                  ).map((mode) => (
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

              {visibleGroups.length === 0 ? (
                <section className="empty-state">
                  <Sticker size={32} />
                  <h2>No matching stickers</h2>
                  <p>Clear search or change filters to see more of the album.</p>
                </section>
              ) : null}

              <section className="groups" aria-label="Sticker groups">
                {visibleGroups.map((group) => (
                  <StickerSection
                    key={group.id}
                    album={album}
                    group={group}
                    items={items}
                    isExpanded={expandedGroups.has(group.id)}
                    expandedTeams={expandedTeams}
                    workMode={workMode}
                    onToggleGroup={() => toggleGroup(group.id)}
                    onToggleTeam={toggleTeam}
                    onCollection={setCollection}
                    onDuplicate={changeDuplicate}
                  />
                ))}
              </section>
            </>
          )}
        </>
      )}

      {screen !== 'albums' ? <BottomNav screen={screen} onSelect={switchScreen} /> : null}
    </main>
  )
}

export default App
