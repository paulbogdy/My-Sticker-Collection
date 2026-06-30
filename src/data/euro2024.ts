import type { Album, Sticker, StickerGroup } from '../types'

type Team = {
  code: string
  name: string
  colors: string[]
  flagCode: string
}

const teams: Record<string, Team> = {
  ALB: { code: 'ALB', name: 'Albania', colors: ['#e41e20', '#000000', '#ffffff'], flagCode: 'al' },
  AUT: { code: 'AUT', name: 'Austria', colors: ['#ed2939', '#ffffff', '#ed2939'], flagCode: 'at' },
  BEL: { code: 'BEL', name: 'Belgium', colors: ['#000000', '#ffd90c', '#ef3340'], flagCode: 'be' },
  BIH: { code: 'BIH', name: 'Bosnia and Herzegovina', colors: ['#002f6c', '#f9d616', '#ffffff'], flagCode: 'ba' },
  CRO: { code: 'CRO', name: 'Croatia', colors: ['#ff0000', '#ffffff', '#171796'], flagCode: 'hr' },
  CZE: { code: 'CZE', name: 'Czechia', colors: ['#ffffff', '#d7141a', '#11457e'], flagCode: 'cz' },
  DEN: { code: 'DEN', name: 'Denmark', colors: ['#c60c30', '#ffffff', '#c60c30'], flagCode: 'dk' },
  ENG: { code: 'ENG', name: 'England', colors: ['#ffffff', '#cf142b', '#00247d'], flagCode: 'gb-eng' },
  ESP: { code: 'ESP', name: 'Spain', colors: ['#aa151b', '#f1bf00', '#aa151b'], flagCode: 'es' },
  EST: { code: 'EST', name: 'Estonia', colors: ['#0072ce', '#000000', '#ffffff'], flagCode: 'ee' },
  FIN: { code: 'FIN', name: 'Finland', colors: ['#ffffff', '#002f6c', '#ffffff'], flagCode: 'fi' },
  FRA: { code: 'FRA', name: 'France', colors: ['#0055a4', '#ffffff', '#ef4135'], flagCode: 'fr' },
  GEO: { code: 'GEO', name: 'Georgia', colors: ['#ffffff', '#ff0000', '#ffffff'], flagCode: 'ge' },
  GER: { code: 'GER', name: 'Germany', colors: ['#000000', '#dd0000', '#ffce00'], flagCode: 'de' },
  GRE: { code: 'GRE', name: 'Greece', colors: ['#0d5eaf', '#ffffff', '#0d5eaf'], flagCode: 'gr' },
  HUN: { code: 'HUN', name: 'Hungary', colors: ['#ce2939', '#ffffff', '#477050'], flagCode: 'hu' },
  ICE: { code: 'ICE', name: 'Iceland', colors: ['#02529c', '#ffffff', '#dc1e35'], flagCode: 'is' },
  ISR: { code: 'ISR', name: 'Israel', colors: ['#ffffff', '#0038b8', '#ffffff'], flagCode: 'il' },
  ITA: { code: 'ITA', name: 'Italy', colors: ['#008c45', '#ffffff', '#cd212a'], flagCode: 'it' },
  KAZ: { code: 'KAZ', name: 'Kazakhstan', colors: ['#00afca', '#f4c430', '#00afca'], flagCode: 'kz' },
  LUX: { code: 'LUX', name: 'Luxembourg', colors: ['#ef3340', '#ffffff', '#00a3e0'], flagCode: 'lu' },
  NED: { code: 'NED', name: 'Netherlands', colors: ['#ae1c28', '#ffffff', '#21468b'], flagCode: 'nl' },
  POL: { code: 'POL', name: 'Poland', colors: ['#ffffff', '#dc143c', '#ffffff'], flagCode: 'pl' },
  POR: { code: 'POR', name: 'Portugal', colors: ['#006600', '#ff0000', '#ffcc00'], flagCode: 'pt' },
  ROM: { code: 'ROM', name: 'Romania', colors: ['#002b7f', '#fcd116', '#ce1126'], flagCode: 'ro' },
  SCO: { code: 'SCO', name: 'Scotland', colors: ['#005eb8', '#ffffff', '#005eb8'], flagCode: 'gb-sct' },
  SRB: { code: 'SRB', name: 'Serbia', colors: ['#c6363c', '#0c4076', '#ffffff'], flagCode: 'rs' },
  SUI: { code: 'SUI', name: 'Switzerland', colors: ['#d52b1e', '#ffffff', '#d52b1e'], flagCode: 'ch' },
  SVK: { code: 'SVK', name: 'Slovakia', colors: ['#ffffff', '#0b4ea2', '#ee1c25'], flagCode: 'sk' },
  SVN: { code: 'SVN', name: 'Slovenia', colors: ['#ffffff', '#005da4', '#ed1c24'], flagCode: 'si' },
  TUR: { code: 'TUR', name: 'Turkey', colors: ['#e30a17', '#ffffff', '#e30a17'], flagCode: 'tr' },
  UKR: { code: 'UKR', name: 'Ukraine', colors: ['#0057b7', '#ffd700', '#0057b7'], flagCode: 'ua' },
  WAL: { code: 'WAL', name: 'Wales', colors: ['#ffffff', '#d30731', '#00ad36'], flagCode: 'gb-wls' },
}

const flagImageForTeam = (team: Team) => `https://flagcdn.com/w160/${team.flagCode}.png`

const flagImagesForTeams = (teamCodes: string[]) =>
  teamCodes.map((code) => ({
    src: flagImageForTeam(teams[code]),
    alt: `${teams[code].code} flag`,
  }))

const range = (prefix: string, count: number, start = 1): Sticker[] =>
  Array.from({ length: count }, (_, index) => ({ code: `${prefix}${index + start}` }))

const teamMeta = (team: Team) => ({
  label: team.name,
  flag: team.code,
  flagImage: flagImageForTeam(team),
  accentColors: team.colors,
  tone: 'team' as const,
})

const overview = (letter: string): Sticker[] => [
  { code: `G${letter}1`, tone: 'intro', mark: `G${letter}` },
  { code: `G${letter}2`, tone: 'intro', mark: `G${letter}` },
]

const landmarks = (teamCodes: string[]): Sticker[] =>
  teamCodes.flatMap((code) => {
    const team = teams[code]
    return [
      { code: `${code}-P1`, ...teamMeta(team) },
      { code: `${code}-P2`, ...teamMeta(team) },
    ]
  })

const teamSpecials = (teamCodes: string[]): Sticker[] =>
  teamCodes.flatMap((code) => {
    const team = teams[code]
    return ['PTW', 'SP', 'TOP1', 'TOP2'].map((suffix) => ({
      code: `${code}-${suffix}`,
      ...teamMeta(team),
    }))
  })

const fullTeam = (code: string): Sticker[] =>
  range(code, 21).map((sticker) => ({
    ...sticker,
    ...teamMeta(teams[code]),
  }))

const playOffTeam = (code: string): Sticker[] => {
  const team = teams[code]
  return [
    { code: `${code}1`, ...teamMeta(team) },
    ...['2-3', '4-5', '6-7', '8-9', '10-11', '12-13', '14-15'].map((suffix) => ({
      code: `${code}${suffix}`,
      ...teamMeta(team),
    })),
  ]
}

const standardGroup = (letter: string, teamCodes: string[]): StickerGroup => ({
  id: `group-${letter.toLowerCase()}`,
  title: `Group ${letter}`,
  flagImages: flagImagesForTeams(teamCodes),
  stickers: [
    ...overview(letter),
    ...landmarks(teamCodes),
    ...teamSpecials(teamCodes),
    ...teamCodes.flatMap(fullTeam),
  ],
})

export const euro2024: Album = {
  id: 'euro-2024-swiss',
  title: 'UEFA Euro 2024',
  edition: 'Topps Swiss Edition',
  source: 'Seeded from the visible LastSticker Topps UEFA Euro 2024 base checklist; full parallel/variant checklist can be added later.',
  expectedTotal: 707,
  theme: {
    mark: '24',
    surface: 'linear-gradient(115deg, #111827 0 28%, #dd0000 28% 56%, #ffce00 56% 78%, #0057b8 78%)',
    progress: 'linear-gradient(90deg, #111827, #dd0000, #ffce00, #0057b8)',
  },
  groups: [
    {
      id: 'intro',
      title: 'Intro',
      subtitle: 'Publisher, UEFA, trophy and host city stickers',
      stickers: [
        { code: 'TOPPS1', tone: 'intro', mark: 'TOPPS' },
        ...range('UEFA', 3).map((sticker) => ({ ...sticker, tone: 'intro' as const, mark: 'UEFA' })),
        ...range('EURO', 11).map((sticker) => ({ ...sticker, tone: 'intro' as const, mark: 'EURO' })),
      ],
    },
    standardGroup('A', ['GER', 'SCO', 'HUN', 'SUI']),
    standardGroup('B', ['ESP', 'CRO', 'ITA', 'ALB']),
    standardGroup('C', ['SVN', 'DEN', 'SRB', 'ENG']),
    {
      id: 'dream-team',
      title: 'Dream Team',
      subtitle: 'Mascot and Jose Mourinho signature sticker',
      stickers: [{ code: 'MM1-2', tone: 'history', mark: 'MM' }],
    },
    {
      id: 'group-d',
      title: 'Group D',
      flagImages: flagImagesForTeams(['POL', 'NED', 'AUT', 'FRA']),
      stickers: [
        ...overview('D'),
        ...landmarks(['NED', 'AUT', 'FRA']),
        { code: 'POL-EST-SP', tone: 'team' },
        { code: 'WAL-FIN-SP', tone: 'team' },
        ...teamSpecials(['NED', 'AUT', 'FRA']),
        ...['POL', 'EST', 'WAL', 'FIN'].flatMap(playOffTeam),
        ...['NED', 'AUT', 'FRA'].flatMap(fullTeam),
      ],
    },
    {
      id: 'group-e',
      title: 'Group E',
      flagImages: flagImagesForTeams(['BEL', 'SVK', 'ROM', 'UKR']),
      stickers: [
        ...overview('E'),
        ...landmarks(['BEL', 'SVK', 'ROM']),
        ...teamSpecials(['BEL', 'SVK', 'ROM']),
        { code: 'ISR-ICE-SP', tone: 'team' },
        { code: 'BIH-UKR-SP', tone: 'team' },
        ...['BEL', 'SVK', 'ROM'].flatMap(fullTeam),
        ...['ISR', 'ICE', 'BIH', 'UKR'].flatMap(playOffTeam),
      ],
    },
    {
      id: 'group-f',
      title: 'Group F',
      flagImages: flagImagesForTeams(['TUR', 'POR', 'CZE', 'GEO']),
      stickers: [
        ...overview('F'),
        ...landmarks(['TUR', 'POR', 'CZE']),
        ...teamSpecials(['TUR']),
        { code: 'GEO-LUX-SP', tone: 'team' },
        { code: 'GRE-KAZ-SP', tone: 'team' },
        ...teamSpecials(['POR', 'CZE']),
        ...fullTeam('TUR'),
        ...['GEO', 'LUX', 'GRE', 'KAZ'].flatMap(playOffTeam),
        ...['POR', 'CZE'].flatMap(fullTeam),
      ],
    },
    {
      id: 'legends',
      title: 'Legends',
      subtitle: 'Euro legends',
      stickers: range('LEG', 10).map((sticker) => ({ ...sticker, tone: 'history' as const, mark: 'LEG' })),
    },
  ],
}
