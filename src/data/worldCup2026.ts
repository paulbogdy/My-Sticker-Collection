import type { Album, Sticker, StickerGroup } from '../types'

type Team = {
  code: string
  name: string
  colors: string[]
}

const flagCodeByCode: Record<string, string> = {
  MEX: 'mx',
  RSA: 'za',
  KOR: 'kr',
  CZE: 'cz',
  CAN: 'ca',
  BIH: 'ba',
  QAT: 'qa',
  SUI: 'ch',
  BRA: 'br',
  MAR: 'ma',
  HAI: 'ht',
  SCO: 'gb-sct',
  USA: 'us',
  PAR: 'py',
  AUS: 'au',
  TUR: 'tr',
  GER: 'de',
  CUW: 'cw',
  CIV: 'ci',
  ECU: 'ec',
  NED: 'nl',
  JPN: 'jp',
  SWE: 'se',
  TUN: 'tn',
  BEL: 'be',
  EGY: 'eg',
  IRN: 'ir',
  NZL: 'nz',
  ESP: 'es',
  CPV: 'cv',
  KSA: 'sa',
  URU: 'uy',
  FRA: 'fr',
  SEN: 'sn',
  IRQ: 'iq',
  NOR: 'no',
  ARG: 'ar',
  ALG: 'dz',
  AUT: 'at',
  JOR: 'jo',
  POR: 'pt',
  COD: 'cd',
  UZB: 'uz',
  COL: 'co',
  ENG: 'gb-eng',
  CRO: 'hr',
  GHA: 'gh',
  PAN: 'pa',
}

const flagImageForTeam = (teamCode: string) => {
  const flagCode = flagCodeByCode[teamCode]
  return flagCode ? `https://flagcdn.com/w160/${flagCode}.png` : undefined
}

const range = (prefix: string, count: number, start = 1): Sticker[] =>
  Array.from({ length: count }, (_, index) => ({ code: `${prefix}${index + start}` }))

const teamStickers = (team: Team): Sticker[] =>
  range(team.code, 20).map((sticker) => ({
    ...sticker,
    label: team.name,
    flag: team.code,
    flagImage: flagImageForTeam(team.code),
    tone: 'team',
    accentColors: team.colors,
  }))

const group = (letter: string, teams: Team[]): StickerGroup => ({
  id: `group-${letter.toLowerCase()}`,
  title: `Group ${letter}`,
  flagImages: teams.flatMap((team) => {
    const src = flagImageForTeam(team.code)
    return src ? [{ src, alt: `${team.code} flag` }] : []
  }),
  stickers: teams.flatMap(teamStickers),
})

export const worldCup2026: Album = {
  id: 'world-cup-2026-standard',
  title: 'FIFA World Cup 2026',
  edition: 'Panini Swiss Edition',
  source: 'Seeded from current FIFA World Cup 2026 group order. Team code prefixes should be checked against a real LastSticker export before first push.',
  theme: {
    mark: '26',
    surface: 'linear-gradient(115deg, #10b981 0 31%, #f7c948 31% 48%, #2563eb 48% 73%, #ef4444 73%)',
    progress: 'linear-gradient(90deg, #10b981, #f7c948, #2563eb)',
  },
  groups: [
    {
      id: 'intro',
      title: 'Intro',
      subtitle: 'Album opening stickers',
      stickers: [
        { code: '00', tone: 'intro', mark: '26' },
        ...range('FWC', 8).map((sticker) => ({ ...sticker, tone: 'intro' as const, mark: '26' })),
      ],
    },
    group('A', [
      { code: 'MEX', name: 'Mexico', colors: ['#006847', '#ffffff', '#ce1126'] },
      { code: 'RSA', name: 'South Africa', colors: ['#007a4d', '#ffb612', '#de3831'] },
      { code: 'KOR', name: 'South Korea', colors: ['#ffffff', '#c60c30', '#003478'] },
      { code: 'CZE', name: 'Czechia', colors: ['#ffffff', '#d7141a', '#11457e'] },
    ]),
    group('B', [
      { code: 'CAN', name: 'Canada', colors: ['#ff0000', '#ffffff', '#ff0000'] },
      { code: 'BIH', name: 'Bosnia and Herzegovina', colors: ['#002f6c', '#f9d616', '#ffffff'] },
      { code: 'QAT', name: 'Qatar', colors: ['#8a1538', '#ffffff', '#8a1538'] },
      { code: 'SUI', name: 'Switzerland', colors: ['#d52b1e', '#ffffff', '#d52b1e'] },
    ]),
    group('C', [
      { code: 'BRA', name: 'Brazil', colors: ['#009b3a', '#ffdf00', '#002776'] },
      { code: 'MAR', name: 'Morocco', colors: ['#c1272d', '#006233', '#c1272d'] },
      { code: 'HAI', name: 'Haiti', colors: ['#00209f', '#d21034', '#ffffff'] },
      { code: 'SCO', name: 'Scotland', colors: ['#005eb8', '#ffffff', '#005eb8'] },
    ]),
    group('D', [
      { code: 'USA', name: 'United States', colors: ['#3c3b6e', '#ffffff', '#b22234'] },
      { code: 'PAR', name: 'Paraguay', colors: ['#d52b1e', '#ffffff', '#0038a8'] },
      { code: 'AUS', name: 'Australia', colors: ['#012169', '#ffffff', '#e4002b'] },
      { code: 'TUR', name: 'Turkey', colors: ['#e30a17', '#ffffff', '#e30a17'] },
    ]),
    group('E', [
      { code: 'GER', name: 'Germany', colors: ['#000000', '#dd0000', '#ffce00'] },
      { code: 'CUW', name: 'Curacao', colors: ['#002b7f', '#f9e814', '#ffffff'] },
      { code: 'CIV', name: 'Ivory Coast', colors: ['#f77f00', '#ffffff', '#009e60'] },
      { code: 'ECU', name: 'Ecuador', colors: ['#ffdd00', '#034ea2', '#ed1c24'] },
    ]),
    group('F', [
      { code: 'NED', name: 'Netherlands', colors: ['#ae1c28', '#ffffff', '#21468b'] },
      { code: 'JPN', name: 'Japan', colors: ['#ffffff', '#bc002d', '#ffffff'] },
      { code: 'SWE', name: 'Sweden', colors: ['#006aa7', '#fecc00', '#006aa7'] },
      { code: 'TUN', name: 'Tunisia', colors: ['#e70013', '#ffffff', '#e70013'] },
    ]),
    group('G', [
      { code: 'BEL', name: 'Belgium', colors: ['#000000', '#ffd90c', '#ef3340'] },
      { code: 'EGY', name: 'Egypt', colors: ['#ce1126', '#ffffff', '#000000'] },
      { code: 'IRN', name: 'Iran', colors: ['#239f40', '#ffffff', '#da0000'] },
      { code: 'NZL', name: 'New Zealand', colors: ['#00247d', '#ffffff', '#cc142b'] },
    ]),
    group('H', [
      { code: 'ESP', name: 'Spain', colors: ['#aa151b', '#f1bf00', '#aa151b'] },
      { code: 'CPV', name: 'Cape Verde', colors: ['#003893', '#ffffff', '#cf2027'] },
      { code: 'KSA', name: 'Saudi Arabia', colors: ['#006c35', '#ffffff', '#006c35'] },
      { code: 'URU', name: 'Uruguay', colors: ['#ffffff', '#0038a8', '#fcd116'] },
    ]),
    group('I', [
      { code: 'FRA', name: 'France', colors: ['#0055a4', '#ffffff', '#ef4135'] },
      { code: 'SEN', name: 'Senegal', colors: ['#00853f', '#fdef42', '#e31b23'] },
      { code: 'IRQ', name: 'Iraq', colors: ['#ce1126', '#ffffff', '#000000'] },
      { code: 'NOR', name: 'Norway', colors: ['#ba0c2f', '#ffffff', '#00205b'] },
    ]),
    group('J', [
      { code: 'ARG', name: 'Argentina', colors: ['#75aadb', '#ffffff', '#f6b40e'] },
      { code: 'ALG', name: 'Algeria', colors: ['#006233', '#ffffff', '#d21034'] },
      { code: 'AUT', name: 'Austria', colors: ['#ed2939', '#ffffff', '#ed2939'] },
      { code: 'JOR', name: 'Jordan', colors: ['#000000', '#ffffff', '#007a3d'] },
    ]),
    group('K', [
      { code: 'POR', name: 'Portugal', colors: ['#006600', '#ff0000', '#ffcc00'] },
      { code: 'COD', name: 'DR Congo', colors: ['#007fff', '#f7d618', '#ce1021'] },
      { code: 'UZB', name: 'Uzbekistan', colors: ['#1eb5e5', '#ffffff', '#009739'] },
      { code: 'COL', name: 'Colombia', colors: ['#fcd116', '#003893', '#ce1126'] },
    ]),
    group('L', [
      { code: 'ENG', name: 'England', colors: ['#ffffff', '#cf142b', '#00247d'] },
      { code: 'CRO', name: 'Croatia', colors: ['#ff0000', '#ffffff', '#171796'] },
      { code: 'GHA', name: 'Ghana', colors: ['#ce1126', '#fcd116', '#006b3f'] },
      { code: 'PAN', name: 'Panama', colors: ['#ffffff', '#005293', '#d21034'] },
    ]),
    {
      id: 'world-cup-history',
      title: 'FIFA World Cup History',
      subtitle: 'History foil stickers',
      stickers: range('FWC', 11, 9).map((sticker) => ({
        ...sticker,
        tone: 'history' as const,
        mark: 'FWC',
      })),
    },
    {
      id: 'coca-cola',
      title: 'Coca-Cola',
      subtitle: 'Coca-Cola stickers',
      stickers: range('CC', 12).map((sticker) => ({
        ...sticker,
        tone: 'sponsor' as const,
        mark: 'CC',
      })),
    },
  ],
}
