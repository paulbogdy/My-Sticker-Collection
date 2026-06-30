import { Check, ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react'
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
  const blockByTitle = new Map<string, (typeof blocks)[number]>()

  stickers.forEach((sticker) => {
    const blockKey = sticker.label ?? 'stickers'
    const existingBlock = blockByTitle.get(blockKey)

    if (existingBlock) {
      existingBlock.stickers.push(sticker)
      return
    }

    const nextBlock = {
      title: sticker.label,
      stickers: [sticker],
      accentColors: sticker.accentColors,
      flag: sticker.flag,
      flagImage: sticker.flagImage,
    }
    blocks.push(nextBlock)
    blockByTitle.set(blockKey, nextBlock)
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
  isExpanded: boolean
  expandedTeams: Set<string>
  workMode: WorkMode
  onToggleGroup: () => void
  onToggleTeam: (teamId: string) => void
  onCollection: (code: string, owned: boolean) => void
  onDuplicate: (code: string, delta: number) => void
}

export function StickerSection({
  album,
  group,
  items,
  isExpanded,
  expandedTeams,
  workMode,
  onToggleGroup,
  onToggleTeam,
  onCollection,
  onDuplicate,
}: StickerSectionProps) {
  const activeCount = countForMode(group.stickers, items, workMode)
  const teamBlocks = isExpanded ? groupByTeam(group.stickers) : []

  return (
    <article className="group-block">
      <header>
        <button className="group-toggle" type="button" onClick={onToggleGroup} aria-expanded={isExpanded}>
          <span className="chevron">{isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
          <span>
            <h2 className="group-title">
              <span>{group.title}</span>
              {group.flagImages?.length ? (
                <span className="group-flags" aria-hidden="true">
                  {group.flagImages.map((flag) => (
                    <img key={flag.alt} src={flag.src} alt="" loading="lazy" />
                  ))}
                </span>
              ) : null}
            </h2>
            {group.subtitle ? <p>{group.subtitle}</p> : null}
          </span>
          <span className="count-pill">
            {activeCount}/{group.stickers.length}
          </span>
        </button>
      </header>
      {isExpanded ? (
        <div className="team-list">
          {teamBlocks.map((block, index) => {
            const teamId = `${group.id}:${block.title ?? 'stickers'}:${index}`
            return (
              <TeamBlock
                key={teamId}
                album={album}
                teamId={teamId}
                title={block.title}
                stickers={block.stickers}
                accentColors={block.accentColors}
                flag={block.flag}
                flagImage={block.flagImage}
                isExpanded={!block.title || expandedTeams.has(teamId)}
                items={items}
                workMode={workMode}
                onToggleTeam={onToggleTeam}
                onCollection={onCollection}
                onDuplicate={onDuplicate}
              />
            )
          })}
        </div>
      ) : null}
    </article>
  )
}

function TeamBlock({
  album,
  teamId,
  title,
  stickers,
  accentColors,
  flag,
  flagImage,
  isExpanded,
  items,
  workMode,
  onToggleTeam,
  onCollection,
  onDuplicate,
}: {
  album: Album
  teamId: string
  title?: string
  stickers: Sticker[]
  accentColors?: string[]
  flag?: string
  flagImage?: string
  isExpanded: boolean
  items: InventoryByCode
  workMode: WorkMode
  onToggleTeam: (teamId: string) => void
  onCollection: (code: string, owned: boolean) => void
  onDuplicate: (code: string, delta: number) => void
}) {
  const activeCount = countForMode(stickers, items, workMode)

  return (
    <section className="team-block" style={flagStripeStyle(accentColors)}>
      {title ? (
        <header className="team-header">
          <button className="team-toggle" type="button" onClick={() => onToggleTeam(teamId)} aria-expanded={isExpanded}>
            <span className="chevron">{isExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}</span>
            <span className="team-title">
              {flagImage ? <img className="team-flag-chip" src={flagImage} alt={`${flag ?? title} flag`} loading="lazy" /> : null}
              <h3>{title}</h3>
            </span>
            <span className="count-pill">{activeCount}/{stickers.length}</span>
          </button>
        </header>
      ) : null}
      {isExpanded ? <div className="sticker-grid">
        {stickers.map((sticker) => {
          const item = items[sticker.code] ?? emptyItem(album.id, sticker.code)
          const owned = item.collectionQty > 0
          const tileClassName = [
            'sticker-tile',
            `sticker-tone-${sticker.tone ?? 'team'}`,
            owned ? 'owned' : '',
          ].join(' ')
          const tileStyle = {
            '--sticker-mark': JSON.stringify(sticker.mark ?? ''),
          } as CSSProperties
          return (
            <div className={tileClassName} key={sticker.code} style={tileStyle}>
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
      </div> : null}
    </section>
  )
}
