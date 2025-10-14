import { MatchUI, RoundBucket } from '../types/bracket.types';

export function byRounds(matches: MatchUI[]): RoundBucket[] {
  const map = new Map<number, MatchUI[]>();
  for (const m of matches) {
    if (!map.has(m.round)) map.set(m.round, []);
    map.get(m.round)!.push(m);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([round, list]) => ({ round, matches: list }));
}
