import { Copy, Download, RotateCcw, Upload } from 'lucide-react'
import type { WorkMode } from '../types'

type SyncScreenProps = {
  importText: string
  message: string
  workMode: WorkMode
  setImportText: (value: string) => void
  setWorkMode: (value: WorkMode) => void
  importCodes: () => void
  copyText: (text: string, label: string) => void
  exportCollection: () => string
  exportDuplicates: () => string
  downloadBackup: () => void
  resetAlbum: () => void
}

export function SyncScreen({
  importText,
  message,
  workMode,
  setImportText,
  setWorkMode,
  importCodes,
  copyText,
  exportCollection,
  exportDuplicates,
  downloadBackup,
  resetAlbum,
}: SyncScreenProps) {
  return (
    <section className="sync-screen" aria-label="Import and export">
      <div className="screen-heading">
        <p className="eyebrow">LastSticker</p>
        <h2>Sync tools</h2>
      </div>
      <div className="sync-panel">
        <div className="segments import-target" role="tablist" aria-label="Import target">
          {(['collection', 'duplicates'] as const).map((mode) => (
            <button
              key={mode}
              className={workMode === mode ? 'active' : ''}
              onClick={() => setWorkMode(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder={`Paste ${workMode} codes: MEX11, SUI20, FWC1`}
          rows={5}
        />
        <button className="primary-action" type="button" onClick={importCodes}>
          <Upload size={18} /> Import to {workMode}
        </button>
        <p className="status-line">{message}</p>
      </div>

      <div className="action-list">
        <button type="button" onClick={() => copyText(exportCollection(), 'Collection export')}>
          <Copy size={18} />
          <span>
            <strong>Copy collection</strong>
            <small>Comma-separated owned stickers</small>
          </span>
        </button>
        <button type="button" onClick={() => copyText(exportDuplicates(), 'Duplicates export')}>
          <Copy size={18} />
          <span>
            <strong>Copy duplicates</strong>
            <small>Repeats duplicate codes by quantity</small>
          </span>
        </button>
        <button type="button" onClick={downloadBackup}>
          <Download size={18} />
          <span>
            <strong>Download backup</strong>
            <small>Save local data as JSON</small>
          </span>
        </button>
        <button className="danger-action" type="button" onClick={resetAlbum}>
          <RotateCcw size={18} />
          <span>
            <strong>Reset album</strong>
            <small>Clear local sticker data</small>
          </span>
        </button>
      </div>
    </section>
  )
}
