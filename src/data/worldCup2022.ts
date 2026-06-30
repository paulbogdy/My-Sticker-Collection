import type { Album, Sticker, StickerGroup } from '../types'

type Team = {
  code: string
  name: string
  colors: string[]
  flagCode: string
}

const teams: Record<string, Team> = {
  ARG: { code: 'ARG', name: 'Argentina', colors: ['#75aadb', '#ffffff', '#f6b40e'], flagCode: 'ar' },
  AUS: { code: 'AUS', name: 'Australia', colors: ['#012169', '#ffffff', '#e4002b'], flagCode: 'au' },
  BEL: { code: 'BEL', name: 'Belgium', colors: ['#000000', '#ffd90c', '#ef3340'], flagCode: 'be' },
  BRA: { code: 'BRA', name: 'Brazil', colors: ['#009b3a', '#ffdf00', '#002776'], flagCode: 'br' },
  CAN: { code: 'CAN', name: 'Canada', colors: ['#ff0000', '#ffffff', '#ff0000'], flagCode: 'ca' },
  CMR: { code: 'CMR', name: 'Cameroon', colors: ['#007a5e', '#ce1126', '#fcd116'], flagCode: 'cm' },
  CRC: { code: 'CRC', name: 'Costa Rica', colors: ['#002b7f', '#ffffff', '#ce1126'], flagCode: 'cr' },
  CRO: { code: 'CRO', name: 'Croatia', colors: ['#ff0000', '#ffffff', '#171796'], flagCode: 'hr' },
  DEN: { code: 'DEN', name: 'Denmark', colors: ['#c60c30', '#ffffff', '#c60c30'], flagCode: 'dk' },
  ECU: { code: 'ECU', name: 'Ecuador', colors: ['#ffdd00', '#034ea2', '#ed1c24'], flagCode: 'ec' },
  ENG: { code: 'ENG', name: 'England', colors: ['#ffffff', '#cf142b', '#00247d'], flagCode: 'gb-eng' },
  ESP: { code: 'ESP', name: 'Spain', colors: ['#aa151b', '#f1bf00', '#aa151b'], flagCode: 'es' },
  FRA: { code: 'FRA', name: 'France', colors: ['#0055a4', '#ffffff', '#ef4135'], flagCode: 'fr' },
  GER: { code: 'GER', name: 'Germany', colors: ['#000000', '#dd0000', '#ffce00'], flagCode: 'de' },
  GHA: { code: 'GHA', name: 'Ghana', colors: ['#ce1126', '#fcd116', '#006b3f'], flagCode: 'gh' },
  IRN: { code: 'IRN', name: 'Iran', colors: ['#239f40', '#ffffff', '#da0000'], flagCode: 'ir' },
  JPN: { code: 'JPN', name: 'Japan', colors: ['#ffffff', '#bc002d', '#ffffff'], flagCode: 'jp' },
  KOR: { code: 'KOR', name: 'South Korea', colors: ['#ffffff', '#c60c30', '#003478'], flagCode: 'kr' },
  KSA: { code: 'KSA', name: 'Saudi Arabia', colors: ['#006c35', '#ffffff', '#006c35'], flagCode: 'sa' },
  MAR: { code: 'MAR', name: 'Morocco', colors: ['#c1272d', '#006233', '#c1272d'], flagCode: 'ma' },
  MEX: { code: 'MEX', name: 'Mexico', colors: ['#006847', '#ffffff', '#ce1126'], flagCode: 'mx' },
  NED: { code: 'NED', name: 'Netherlands', colors: ['#ae1c28', '#ffffff', '#21468b'], flagCode: 'nl' },
  POL: { code: 'POL', name: 'Poland', colors: ['#ffffff', '#dc143c', '#ffffff'], flagCode: 'pl' },
  POR: { code: 'POR', name: 'Portugal', colors: ['#006600', '#ff0000', '#ffcc00'], flagCode: 'pt' },
  QAT: { code: 'QAT', name: 'Qatar', colors: ['#8a1538', '#ffffff', '#8a1538'], flagCode: 'qa' },
  SEN: { code: 'SEN', name: 'Senegal', colors: ['#00853f', '#fdef42', '#e31b23'], flagCode: 'sn' },
  SRB: { code: 'SRB', name: 'Serbia', colors: ['#c6363c', '#0c4076', '#ffffff'], flagCode: 'rs' },
  SUI: { code: 'SUI', name: 'Switzerland', colors: ['#d52b1e', '#ffffff', '#d52b1e'], flagCode: 'ch' },
  TUN: { code: 'TUN', name: 'Tunisia', colors: ['#e70013', '#ffffff', '#e70013'], flagCode: 'tn' },
  URU: { code: 'URU', name: 'Uruguay', colors: ['#ffffff', '#0038a8', '#fcd116'], flagCode: 'uy' },
  USA: { code: 'USA', name: 'United States', colors: ['#3c3b6e', '#ffffff', '#b22234'], flagCode: 'us' },
  WAL: { code: 'WAL', name: 'Wales', colors: ['#ffffff', '#d30731', '#00ad36'], flagCode: 'gb-wls' },
}

const range = (prefix: string, count: number, start = 1): Sticker[] =>
  Array.from({ length: count }, (_, index) => ({ code: `${prefix}${index + start}` }))

const flagImageForTeam = (team: Team) => `https://flagcdn.com/w160/${team.flagCode}.png`

const teamStickers = (code: string): Sticker[] => {
  const team = teams[code]
  return range(team.code, 20).map((sticker) => ({
    ...sticker,
    label: team.name,
    flag: team.code,
    flagImage: flagImageForTeam(team),
    tone: 'team' as const,
    accentColors: team.colors,
  }))
}

const group = (letter: string, teamCodes: string[]): StickerGroup => ({
  id: `group-${letter.toLowerCase()}`,
  title: `Group ${letter}`,
  flagImages: teamCodes.map((code) => ({
    src: flagImageForTeam(teams[code]),
    alt: `${teams[code].code} flag`,
  })),
  stickers: teamCodes.flatMap(teamStickers),
})

export const worldCup2022: Album = {
  id: 'world-cup-2022-swiss',
  title: 'FIFA World Cup Qatar 2022',
  edition: 'Panini Swiss Edition',
  source: 'Seeded as the Panini Qatar 2022 base album: 00, FWC1-FWC29, then 32 teams with 20 stickers each in official group order.',
  expectedTotal: 670,
  theme: {
    mark: '22',
    surface: 'linear-gradient(115deg, #8a1538 0 34%, #ffffff 34% 46%, #00a3a1 46% 72%, #f3c677 72%)',
    progress: 'linear-gradient(90deg, #8a1538, #00a3a1, #f3c677)',
  },
  groups: [
    {
      id: 'intro',
      title: 'Intro',
      subtitle: 'Album opening stickers',
      stickers: [
        { code: '00', tone: 'intro', mark: '22' },
        ...range('FWC', 29).map((sticker) => ({ ...sticker, tone: 'intro' as const, mark: 'FWC' })),
      ],
    },
    group('A', ['QAT', 'ECU', 'SEN', 'NED']),
    group('B', ['ENG', 'IRN', 'USA', 'WAL']),
    group('C', ['ARG', 'KSA', 'MEX', 'POL']),
    group('D', ['FRA', 'AUS', 'DEN', 'TUN']),
    group('E', ['ESP', 'CRC', 'GER', 'JPN']),
    group('F', ['BEL', 'CAN', 'MAR', 'CRO']),
    group('G', ['BRA', 'SRB', 'SUI', 'CMR']),
    group('H', ['POR', 'GHA', 'URU', 'KOR']),
  ],
}
