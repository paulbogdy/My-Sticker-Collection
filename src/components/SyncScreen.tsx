import { Copy, Download, RotateCcw, Upload } from 'lucide-react'
import type { SyncImportMode } from '../types'

type SyncScreenProps = {
  importText: string
  message: string
  importMode: SyncImportMode
  setImportText: (value: string) => void
  setImportMode: (value: SyncImportMode) => void
  importCodes: () => void
  copyText: (text: string, label: string) => void
  exportMissing: () => string
  exportSpares: () => string
  downloadBackup: () => void
  resetAlbum: () => void
}

export function SyncScreen({
  importText,
  message,
  importMode,
  setImportText,
  setImportMode,
  importCodes,
  copyText,
  exportMissing,
  exportSpares,
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
          {(['missing', 'spares'] as const).map((mode) => (
            <button
              key={mode}
              className={importMode === mode ? 'active' : ''}
              onClick={() => setImportMode(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder={`Paste LastSticker ${importMode} codes: MEX11, SUI20, FWC1`}
          rows={5}
        />
        <button className="primary-action" type="button" onClick={importCodes}>
          <Upload size={18} /> Import {importMode}
        </button>
        <p className="status-line">{message}</p>
      </div>

      <div className="action-list">
        <button type="button" onClick={() => copyText(exportMissing(), 'Missing export')}>
          <Copy size={18} />
          <span>
            <strong>Copy missing</strong>
            <small>Stickers still needed for LastSticker</small>
          </span>
        </button>
        <button type="button" onClick={() => copyText(exportSpares(), 'Spares export')}>
          <Copy size={18} />
          <span>
            <strong>Copy spares</strong>
            <small>Uses LastSticker quantities like MEX6(2)</small>
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
