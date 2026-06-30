const quantityPattern = /^(.+?)(?:\((\d+)\))?$/

export const parseStickerCodes = (input: string): string[] =>
  input
    .split(/[\s,;]+/)
    .flatMap((rawCode) => {
      const token = rawCode.trim().toUpperCase()
      if (!token) return []

      const match = token.match(quantityPattern)
      const code = match?.[1]?.trim()
      if (!code) return []

      const quantity = match?.[2] ? Number(match[2]) : 1
      return Array.from({ length: Math.max(1, quantity) }, () => code)
    })

export const formatStickerCodes = (codes: string[]): string => codes.join(', ')

export const formatStickerQuantities = (entries: Array<{ code: string; qty: number }>): string =>
  entries
    .filter((entry) => entry.qty > 0)
    .map((entry) => (entry.qty > 1 ? `${entry.code}(${entry.qty})` : entry.code))
    .join(', ')

export const repeatedCodes = (entries: Array<{ code: string; qty: number }>): string[] =>
  entries.flatMap((entry) => Array.from({ length: Math.max(0, entry.qty) }, () => entry.code))
