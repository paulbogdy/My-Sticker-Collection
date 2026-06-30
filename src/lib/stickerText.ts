export const parseStickerCodes = (input: string): string[] =>
  input
    .split(/[\s,;]+/)
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean)

export const formatStickerCodes = (codes: string[]): string => codes.join(', ')

export const repeatedCodes = (entries: Array<{ code: string; qty: number }>): string[] =>
  entries.flatMap((entry) => Array.from({ length: Math.max(0, entry.qty) }, () => entry.code))
