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
  expectedTotal: number
  groups: StickerGroup[]
}

const range = (prefix: string, count: number, start = 1): Sticker[] =>
  Array.from({ length: count }, (_, index) => ({ code: `${prefix}${index + start}` }))

const team = (code: string, name: string): StickerGroup => ({
  id: code.toLowerCase(),
  title: name,
  subtitle: `${code}1-${code}20`,
  stickers: range(code, 20),
})

export const albums: Album[] = [
  {
    id: 'world-cup-2026-standard',
    title: 'FIFA World Cup 2026',
    edition: 'Panini Standard Edition',
    source: 'Seeded from the public LastSticker checklist structure. Team/player labels can be refined as we compare against your account.',
    expectedTotal: 1219,
    groups: [
      {
        id: 'intro',
        title: 'Intro',
        subtitle: 'Album logo and FWC intro stickers',
        stickers: [{ code: '00' }, ...range('FWC', 14)],
      },
      team('ARG', 'Argentina'),
      team('AUS', 'Australia'),
      team('BEL', 'Belgium'),
      team('BRA', 'Brazil'),
      team('CMR', 'Cameroon'),
      team('CAN', 'Canada'),
      team('CRO', 'Croatia'),
      team('DEN', 'Denmark'),
      team('ECU', 'Ecuador'),
      team('ENG', 'England'),
      team('FRA', 'France'),
      team('GER', 'Germany'),
      team('GHA', 'Ghana'),
      team('IRN', 'Iran'),
      team('JPN', 'Japan'),
      team('KOR', 'Korea Republic'),
      team('MEX', 'Mexico'),
      team('MAR', 'Morocco'),
      team('NED', 'Netherlands'),
      team('POL', 'Poland'),
      team('POR', 'Portugal'),
      team('QAT', 'Qatar'),
      team('KSA', 'Saudi Arabia'),
      team('SEN', 'Senegal'),
      team('SRB', 'Serbia'),
      team('ESP', 'Spain'),
      team('SUI', 'Switzerland'),
      team('TUN', 'Tunisia'),
      team('USA', 'United States'),
      team('URU', 'Uruguay'),
      team('WAL', 'Wales'),
      team('BOL', 'Bolivia'),
      team('JAM', 'Jamaica'),
      team('NZL', 'New Zealand'),
      team('MKD', 'North Macedonia'),
      team('VEN', 'Venezuela'),
      {
        id: 'coca-cola-team-believers',
        title: 'Coca-Cola Team Believers',
        subtitle: 'Special insert section',
        stickers: range('CC', 12),
      },
      {
        id: 'top-master',
        title: 'Top Master',
        subtitle: 'Special insert section',
        stickers: range('TM', 14),
      },
      {
        id: 'stadiums',
        title: 'Stadiums',
        subtitle: 'Special insert section',
        stickers: range('ST', 14),
      },
      {
        id: 'legends',
        title: 'Legends',
        subtitle: 'Special insert section',
        stickers: range('L', 12),
      },
      {
        id: 'extra',
        title: 'Extra',
        subtitle: 'Extra stickers',
        stickers: range('EXTRA', 20),
      },
      {
        id: 'update',
        title: 'Update',
        subtitle: 'Update stickers',
        stickers: range('UPD', 6),
      },
    ],
  },
]

export const getAlbumStickers = (album: Album): Sticker[] =>
  album.groups.flatMap((group) => group.stickers)
