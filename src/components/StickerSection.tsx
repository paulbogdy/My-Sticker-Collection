import { Check, Minus, Plus } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Album, InventoryByCode, Sticker, StickerGroup, WorkMode } from '../types'
import { makeInventoryId, type InventoryItem } from '../lib/db'

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

const groupByTeam = (stickers: Sticker[]) => {
  const blocks: Array<{
    title?: string
    stickers: Sticker[]
    accentColors?: string[]
    flag?: string
    flagImage?: string
  }> = []

  stickers.forEach((sticker) => {
    const lastBlock = blocks.at(-1)
    if (lastBlock && lastBlock.title === sticker.label) {
      lastBlock.stickers.push(sticker)
      return
    }

    blocks.push({
      title: sticker.label,
      stickers: [sticker],
      accentColors: sticker.accentColors,
      flag: sticker.flag,
      flagImage: sticker.flagImage,
    })
  })

  return blocks
}

const countForMode = (
  stickers: Sticker[],
  items: InventoryByCode,
  workMode: WorkMode,
) => {
  if (workMode === 'duplicates') {
    return stickers.filter((sticker) => (items[sticker.code]?.duplicateQty ?? 0) > 0).length
  }

  return stickers.filter((sticker) => (items[sticker.code]?.collectionQty ?? 0) > 0).length
}

const flagStripeStyle = (colors?: string[]) => {
  if (!colors?.length) return undefined
  const safeColors = colors.slice(0, 3)
  const stripe = `linear-gradient(90deg, ${safeColors
    .map((color, index) => `${color} ${(index / safeColors.length) * 100}% ${((index + 1) / safeColors.length) * 100}%`)
    .join(', ')})`
  const wash = `linear-gradient(135deg, ${safeColors
    .map((color, index) => `${color}26 ${(index / safeColors.length) * 100}% ${((index + 1) / safeColors.length) * 100}%`)
    .join(', ')})`

  return { '--team-stripe': stripe, '--team-wash': wash } as CSSProperties
}

type StickerSectionProps = {
  album: Album
  group: StickerGroup
  items: InventoryByCode
  workMode: WorkMode
  onCollection: (code: string, owned: boolean) => void
  onDuplicate: (code: string, delta: number) => void
}

export function StickerSection({
  album,
  group,
  items,
  workMode,
  onCollection,
  onDuplicate,
}: StickerSectionProps) {
  const activeCount = countForMode(group.stickers, items, workMode)
  const teamBlocks = groupByTeam(group.stickers)

  return (
    <article className="group-block">
      <header>
        <div>
          <h2>{group.title}</h2>
          {group.subtitle ? <p>{group.subtitle}</p> : null}
        </div>
        <span>
          {activeCount}/{group.stickers.length}
        </span>
      </header>
      <div className="team-list">
        {teamBlocks.map((block, index) => (
          <TeamBlock
            key={`${block.title ?? group.id}-${index}`}
            album={album}
            title={block.title}
            stickers={block.stickers}
            accentColors={block.accentColors}
            flag={block.flag}
            flagImage={block.flagImage}
            items={items}
            workMode={workMode}
            onCollection={onCollection}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>
    </article>
  )
}

function TeamBlock({
  album,
  title,
  stickers,
  accentColors,
  flag,
  flagImage,
  items,
  workMode,
  onCollection,
  onDuplicate,
}: {
  album: Album
  title?: string
  stickers: Sticker[]
  accentColors?: string[]
  flag?: string
  flagImage?: string
  items: InventoryByCode
  workMode: WorkMode
  onCollection: (code: string, owned: boolean) => void
  onDuplicate: (code: string, delta: number) => void
}) {
  const activeCount = countForMode(stickers, items, workMode)

  return (
    <section className="team-block" style={flagStripeStyle(accentColors)}>
      {title ? (
        <header className="team-header">
          <div className="team-title">
            {flagImage ? <img className="team-flag-chip" src={flagImage} alt={`${flag ?? title} flag`} loading="lazy" /> : null}
            <h3>{title}</h3>
          </div>
          <span>{activeCount}/{stickers.length}</span>
        </header>
      ) : null}
      <div className="sticker-grid">
        {stickers.map((sticker) => {
          const item = items[sticker.code] ?? emptyItem(album.id, sticker.code)
          const owned = item.collectionQty > 0
          const tileClassName = [
            'sticker-tile',
            `sticker-${sticker.shape ?? 'portrait'}`,
            `sticker-tone-${sticker.tone ?? 'team'}`,
            sticker.pair ? `sticker-pair-${sticker.pair}` : '',
            owned ? 'owned' : '',
          ].join(' ')
          return (
            <div className={tileClassName} key={sticker.code}>
              {sticker.flagImage ? (
                <img className="tile-flag-mark" src={sticker.flagImage} alt="" loading="lazy" />
              ) : null}
              {workMode === 'collection' ? (
                <button
                  className="owned-toggle"
                  type="button"
                  onClick={() => onCollection(sticker.code, !owned)}
                  aria-label={`${owned ? 'Remove' : 'Add'} ${sticker.code} from collection`}
                >
                  <span>{sticker.code}</span>
                  {owned ? <Check size={18} /> : null}
                </button>
              ) : (
                <>
                  <div className="dupe-code">{sticker.code}</div>
                  <div className="dupe-stepper" aria-label={`${sticker.code} duplicates`}>
                    <button type="button" onClick={() => onDuplicate(sticker.code, -1)} aria-label="Remove duplicate">
                      <Minus size={16} />
                    </button>
                    <strong>{item.duplicateQty}</strong>
                    <button type="button" onClick={() => onDuplicate(sticker.code, 1)} aria-label="Add duplicate">
                      <Plus size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
