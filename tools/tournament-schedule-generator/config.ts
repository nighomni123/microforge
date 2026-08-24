import type { ToolConfig } from '../../src/engine/schema'

/**
 * Tournament Schedule Generator — splits players into balanced teams and
 * builds a full round-robin fixture list (circle method) with 3/1/0 scoring.
 */
export default {
  slug: 'tournament-schedule-generator',
  title: 'Tournament Schedule Generator',
  metaTitle: 'Tournament Schedule Generator — Round Robin Fixtures',
  metaDescription:
    'Splits players into balanced teams and generates every round-robin fixture instantly — winner decided on points, right in your browser.',
  category: 'generators',
  tags: ['tournament', 'round robin', 'fixtures', 'scheduler'],
  icon: '🏆',
  status: 'live',
  description:
    'Turn any player count into balanced teams and a complete round-robin fixture list — perfect for office games, esports nights, and sports days. Every team plays every other team, and the points table crowns the winner.',
  howItWorks:
    'Your players are distributed evenly across the teams you choose. If the count does not divide perfectly, the leftover players are listed as substitutes so every squad stays fair and no one is dropped.\n\nThe generator produces a full round robin: every team plays every other team exactly once. That makes it the fairest format for a league — the best team wins over many matches, unlike single elimination where one loss knocks you out on a bad day.\n\nFixtures come from the classic circle method: one team stays anchored while the others rotate around it each round. This guarantees every pairing appears exactly once and no team plays twice in the same round; with an odd number of teams, the empty slot becomes an automatic BYE.\n\nStandings follow the standard convention: win = 3 pts, draw = 1 pt, loss = 0 pts. The winner is the team with the most points, with head-to-head result and then point difference as tiebreakers.',
  inputs: [
    {
      id: 'totalPlayers',
      label: 'Total players',
      type: 'number',
      default: 16,
      min: 4,
      max: 256,
      step: 1,
    },
    {
      id: 'totalTeams',
      label: 'Number of teams',
      type: 'number',
      default: 4,
      min: 2,
      max: 20,
      step: 1,
      help: 'Players split evenly; extras become substitutes',
    },
  ],
  outputs: [
    { id: 'playersPerTeam', label: 'Players per team', format: 'number', decimals: 0 },
    { id: 'substitutes', label: 'Substitutes', format: 'number', decimals: 0 },
    { id: 'totalMatches', label: 'Total matches', format: 'number', decimals: 0 },
    { id: 'roundsNeeded', label: 'Rounds needed', format: 'number', decimals: 0 },
    { id: 'schedule', label: 'Fixtures', format: 'text', primary: true },
  ],
  faqs: [
    {
      question: 'How is the winner decided?',
      answer:
        'Every fixture is played and recorded as a win (3 pts), draw (1 pt), or loss (0 pts). The champion is the team with the most points when all rounds finish. If two teams tie, the head-to-head result between them breaks the tie first; if still level, the better point difference (points scored minus conceded) decides.',
    },
    {
      question: 'What happens with an odd number of teams?',
      answer:
        'An odd field adds an automatic BYE to the rotation. In each round, the team paired against the BYE simply sits out that round — nobody ever plays twice in the same round, and everyone receives exactly one bye across the schedule.',
    },
    {
      question: 'Should I run a round robin or a knockout bracket?',
      answer:
        'A round robin needs more matches but crowns the consistently best team, since one bad game cannot eliminate a strong side. A knockout finishes faster but is harsher: a single loss ends a team’s run. Choose round robin for leagues and leagues-style events, knockouts when time is short.',
    },
    {
      question: 'Can I add match times or courts?',
      answer:
        'This version orders fixtures only. Assign times or courts yourself by working top-to-bottom through each round — the first pair listed can be match 1 on court 1, the next pair match 2, and so on, keeping play evenly spaced across the round.',
    },
  ],
  keywords: [
    'tournament schedule generator',
    'round robin generator',
    'tournament bracket maker',
    'fixture generator free',
    'league scheduler',
  ],
  autoCompute: true,
  customCompute(inputs) {
    const teams = Math.floor(Number(inputs.totalTeams))
    const players = Math.floor(Number(inputs.totalPlayers))
    if (!Number.isFinite(teams) || !Number.isFinite(players)) {
      throw new Error('Enter whole numbers for players and teams.')
    }
    if (teams < 2) throw new Error('You need at least 2 teams.')
    if (players < teams * 2) {
      throw new Error('Each team needs at least 2 players — add players or use fewer teams.')
    }

    const perTeam = Math.floor(players / teams)
    const subs = players % teams

    const names = Array.from({ length: teams }, (_, i) => `Team ${String.fromCharCode(65 + i)}`)

    // Circle method: anchor the first slot, rotate the rest so every pairing
    // happens exactly once. An odd field gets a BYE filler.
    const list = [...names]
    if (list.length % 2 === 1) list.push('BYE')
    const n = list.length
    const rounds: string[] = []
    for (let r = 0; r < n - 1; r++) {
      const pairs: string[] = []
      for (let i = 0; i < n / 2; i++) {
        const home = list[i]!
        const away = list[n - 1 - i]!
        if (home !== 'BYE' && away !== 'BYE') pairs.push(`${home} vs ${away}`)
      }
      rounds.push(`Round ${r + 1}:  ` + pairs.join('   |   '))
      list.splice(1, 0, list.pop()!)
    }

    const totalMatches = (teams * (teams - 1)) / 2
    const schedule = [
      `${teams} teams · ${perTeam} players per team${subs ? ` · ${subs} substitute${subs > 1 ? 's' : ''}` : ''}`,
      ...rounds,
      'Scoring: win = 3 pts, draw = 1 pt, loss = 0. Winner = most points; tiebreak: head-to-head result, then point difference.',
    ].join('\n')

    return {
      playersPerTeam: perTeam,
      substitutes: subs,
      totalMatches,
      roundsNeeded: rounds.length,
      schedule,
    }
  },
} satisfies ToolConfig
