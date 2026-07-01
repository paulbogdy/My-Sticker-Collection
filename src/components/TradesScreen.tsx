import { Check, Plus, Trash2 } from 'lucide-react'
import type { InventoryByCode, Sticker } from '../types'
import type { Trade, TradeItem } from '../lib/db'

type TradeDraft = {
  partner: string
  outgoingText: string
  incomingText: string
}

type TradesScreenProps = {
  draft: TradeDraft
  items: InventoryByCode
  message: string
  stickers: Sticker[]
  trades: Trade[]
  onDraftChange: (draft: TradeDraft) => void
  onCreateTrade: () => void
  onCompleteTrade: (trade: Trade) => void
  onCancelTrade: (trade: Trade) => void
}

const totalQty = (items: TradeItem[]) => items.reduce((total, item) => total + item.qty, 0)

const formatTradeItems = (items: TradeItem[]) =>
  items.map((item) => (item.qty > 1 ? `${item.code}(${item.qty})` : item.code)).join(', ')

export function TradesScreen({
  draft,
  items,
  message,
  stickers,
  trades,
  onDraftChange,
  onCreateTrade,
  onCompleteTrade,
  onCancelTrade,
}: TradesScreenProps) {
  const activeTrades = trades.filter((trade) => trade.status === 'pending')
  const completedTrades = trades.filter((trade) => trade.status === 'completed')

  return (
    <section className="trades-screen" aria-label="Trades">
      <div className="screen-heading">
        <p className="eyebrow">LastSticker</p>
        <h2>Trades</h2>
      </div>

      <div className="trade-panel">
        <input
          value={draft.partner}
          onChange={(event) => onDraftChange({ ...draft, partner: event.target.value })}
          placeholder="Trader name or note"
        />
        <textarea
          value={draft.outgoingText}
          onChange={(event) => onDraftChange({ ...draft, outgoingText: event.target.value })}
          placeholder="I send: MEX6(2), SUI10"
          rows={4}
        />
        <textarea
          value={draft.incomingText}
          onChange={(event) => onDraftChange({ ...draft, incomingText: event.target.value })}
          placeholder="I receive: BRA7, FWC9"
          rows={4}
        />
        <button className="primary-action" type="button" onClick={onCreateTrade}>
          <Plus size={18} /> Save pending trade
        </button>
        <p className="status-line">{message}</p>
      </div>

      <TradeList
        title="Pending"
        emptyText="No pending trades."
        items={items}
        stickers={stickers}
        trades={activeTrades}
        onCompleteTrade={onCompleteTrade}
        onCancelTrade={onCancelTrade}
      />

      <TradeList
        title="Completed"
        emptyText="No completed trades yet."
        items={items}
        stickers={stickers}
        trades={completedTrades}
      />
    </section>
  )
}

function TradeList({
  title,
  emptyText,
  items,
  stickers,
  trades,
  onCompleteTrade,
  onCancelTrade,
}: {
  title: string
  emptyText: string
  items: InventoryByCode
  stickers: Sticker[]
  trades: Trade[]
  onCompleteTrade?: (trade: Trade) => void
  onCancelTrade?: (trade: Trade) => void
}) {
  return (
    <section className="trade-list" aria-label={title}>
      <h3>{title}</h3>
      {trades.length === 0 ? <p className="trade-empty">{emptyText}</p> : null}
      {trades.map((trade) => (
        <TradeCard
          key={trade.id}
          items={items}
          stickers={stickers}
          trade={trade}
          onCompleteTrade={onCompleteTrade}
          onCancelTrade={onCancelTrade}
        />
      ))}
    </section>
  )
}

function TradeCard({
  items,
  stickers,
  trade,
  onCompleteTrade,
  onCancelTrade,
}: {
  items: InventoryByCode
  stickers: Sticker[]
  trade: Trade
  onCompleteTrade?: (trade: Trade) => void
  onCancelTrade?: (trade: Trade) => void
}) {
  const stickerCodes = new Set(stickers.map((sticker) => sticker.code))
  const outgoingIssues = trade.outgoing.filter((item) => (items[item.code]?.duplicateQty ?? 0) < item.qty)
  const incomingMissingCount = trade.incoming.filter((item) => stickerCodes.has(item.code) && (items[item.code]?.collectionQty ?? 0) === 0).length

  return (
    <article className="trade-card">
      <header>
        <span>
          <strong>{trade.partner || 'Unnamed trade'}</strong>
          <small>{new Date(trade.updatedAt).toLocaleDateString()}</small>
        </span>
        <span className={`trade-status trade-status-${trade.status}`}>{trade.status}</span>
      </header>
      <div className="trade-columns">
        <section>
          <span>I send</span>
          <strong>{totalQty(trade.outgoing)}</strong>
          <p>{formatTradeItems(trade.outgoing) || 'Nothing'}</p>
        </section>
        <section>
          <span>I receive</span>
          <strong>{totalQty(trade.incoming)}</strong>
          <p>{formatTradeItems(trade.incoming) || 'Nothing'}</p>
        </section>
      </div>
      {trade.status === 'pending' && outgoingIssues.length > 0 ? (
        <p className="trade-warning">
          Not enough current spares for {formatTradeItems(outgoingIssues)}.
        </p>
      ) : null}
      {trade.status === 'pending' && incomingMissingCount > 0 ? (
        <p className="trade-note">{incomingMissingCount} incoming sticker types are currently missing.</p>
      ) : null}
      {onCompleteTrade && onCancelTrade ? (
        <div className="trade-actions">
          <button type="button" onClick={() => onCompleteTrade(trade)}>
            <Check size={17} /> Finalize
          </button>
          <button type="button" onClick={() => onCancelTrade(trade)}>
            <Trash2 size={17} /> Cancel
          </button>
        </div>
      ) : null}
    </article>
  )
}
