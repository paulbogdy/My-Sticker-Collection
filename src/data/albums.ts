export type Sticker = {
  code: string
  label?: string
}

export type StickerGroup = {
  id: string
  title: string
  subtitle?: string
  stickers: Sticker[]
}

export type Album = {
  id: string
  title: string
  edition: string
  source: string
  expectedTotal?: number
  groups: StickerGroup[]
}

type Team = {
  code: string
  name: string
}

const range = (prefix: string, count: number, start = 1): Sticker[] =>
  Array.from({ length: count }, (_, index) => ({ code: `${prefix}${index + start}` }))

const teamStickers = (team: Team): Sticker[] =>
  range(team.code, 20).map((sticker) => ({
    ...sticker,
    label: team.name,
  }))

const group = (letter: string, teams: Team[]): StickerGroup => ({
  id: `group-${letter.toLowerCase()}`,
  title: `Group ${letter}`,
  subtitle: teams.map((team) => team.name).join(' · '),
  stickers: teams.flatMap(teamStickers),
})

export const albums: Album[] = [
  {
    id: 'world-cup-2026-standard',
    title: 'FIFA World Cup 2026',
    edition: 'Panini Standard Edition',
    source: 'Seeded from current FIFA World Cup 2026 group order. Team code prefixes should be checked against a real LastSticker export before first push.',
    groups: [
      {
        id: 'intro',
        title: 'Intro',
        subtitle: 'Album opening stickers',
        stickers: [{ code: '00' }, ...range('FWC', 14)],
      },
      group('A', [
        { code: 'MEX', name: 'Mexico' },
        { code: 'RSA', name: 'South Africa' },
        { code: 'KOR', name: 'South Korea' },
        { code: 'CZE', name: 'Czechia' },
      ]),
      group('B', [
        { code: 'CAN', name: 'Canada' },
        { code: 'BIH', name: 'Bosnia and Herzegovina' },
        { code: 'QAT', name: 'Qatar' },
        { code: 'SUI', name: 'Switzerland' },
      ]),
      group('C', [
        { code: 'BRA', name: 'Brazil' },
        { code: 'MAR', name: 'Morocco' },
        { code: 'HAI', name: 'Haiti' },
        { code: 'SCO', name: 'Scotland' },
      ]),
      group('D', [
        { code: 'USA', name: 'United States' },
        { code: 'PAR', name: 'Paraguay' },
        { code: 'AUS', name: 'Australia' },
        { code: 'TUR', name: 'Turkey' },
      ]),
      group('E', [
        { code: 'GER', name: 'Germany' },
        { code: 'CUR', name: 'Curacao' },
        { code: 'CIV', name: 'Ivory Coast' },
        { code: 'ECU', name: 'Ecuador' },
      ]),
      group('F', [
        { code: 'NED', name: 'Netherlands' },
        { code: 'JPN', name: 'Japan' },
        { code: 'SWE', name: 'Sweden' },
        { code: 'TUN', name: 'Tunisia' },
      ]),
      group('G', [
        { code: 'BEL', name: 'Belgium' },
        { code: 'EGY', name: 'Egypt' },
        { code: 'IRN', name: 'Iran' },
        { code: 'NZL', name: 'New Zealand' },
      ]),
      group('H', [
        { code: 'ESP', name: 'Spain' },
        { code: 'CPV', name: 'Cape Verde' },
        { code: 'KSA', name: 'Saudi Arabia' },
        { code: 'URU', name: 'Uruguay' },
      ]),
      group('I', [
        { code: 'FRA', name: 'France' },
        { code: 'SEN', name: 'Senegal' },
        { code: 'IRQ', name: 'Iraq' },
        { code: 'NOR', name: 'Norway' },
      ]),
      group('J', [
        { code: 'ARG', name: 'Argentina' },
        { code: 'ALG', name: 'Algeria' },
        { code: 'AUT', name: 'Austria' },
        { code: 'JOR', name: 'Jordan' },
      ]),
      group('K', [
        { code: 'POR', name: 'Portugal' },
        { code: 'COD', name: 'DR Congo' },
        { code: 'UZB', name: 'Uzbekistan' },
        { code: 'COL', name: 'Colombia' },
      ]),
      group('L', [
        { code: 'ENG', name: 'England' },
        { code: 'CRO', name: 'Croatia' },
        { code: 'GHA', name: 'Ghana' },
        { code: 'PAN', name: 'Panama' },
      ]),
      {
        id: 'coca-cola',
        title: 'Coca-Cola',
        subtitle: 'Coca-Cola special stickers',
        stickers: range('CC', 12),
      },
    ],
  },
]

export const getAlbumStickers = (album: Album): Sticker[] =>
  album.groups.flatMap((group) => group.stickers)
