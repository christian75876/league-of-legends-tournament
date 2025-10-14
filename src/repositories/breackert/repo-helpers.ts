// src/features/bracket/repo-helpers.ts
import { Prisma } from '@prisma/client';
import type { MatchUI, RoundBucket } from '@/features/bracket/types/bracket.types';

export const matchWithRels = Prisma.validator<Prisma.MatchDefaultArgs>()({
  include: {
    participants: {
      select: {
        side: true, // 'A' | 'B'
        team: { select: { id: true, name: true, logoUrl: true } },
      },
      orderBy: { side: 'asc' },
    },
    games: {
      select: { gameIndex: true, winnerSide: true, vodUrl: true },
      orderBy: { gameIndex: 'asc' },
    },
  },
});
export type MatchWithRels = Prisma.MatchGetPayload<typeof matchWithRels>;

export function computeScore(games: Array<{ winnerSide: 'A' | 'B' | null }>): {
  a: number;
  b: number;
} {
  let a = 0,
    b = 0;
  for (const g of games) {
    if (g.winnerSide === 'A') a++;
    else if (g.winnerSide === 'B') b++;
  }
  return { a, b };
}

export function toMatchUI(m: MatchWithRels): MatchUI {
  const A = m.participants.find((p) => p.side === 'A')?.team ?? null;
  const B = m.participants.find((p) => p.side === 'B')?.team ?? null;
  const score = computeScore(m.games as any); // games cumple el shape anterior

  return {
    id: m.id,
    round: m.round ?? 0,
    bestOf: m.bestOf,
    status: m.status as MatchUI['status'],
    scheduledAt: m.scheduledAt ? m.scheduledAt.toISOString() : undefined,
    A: A ? { name: A.name, id: A.id } : null,
    B: B ? { name: B.name, id: B.id } : null,
    score,
  };
}

export function toRoundsUI(matches: MatchWithRels[]): RoundBucket[] {
  const by = new Map<number, MatchWithRels[]>();
  for (const m of matches) {
    const r = m.round ?? 0;
    if (!by.has(r)) by.set(r, []);
    by.get(r)!.push(m);
  }
  return [...by.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([round, list]) => ({ round, matches: list.map(toMatchUI) }));
}

/** Índice 1-based del match `id` dentro de los del mismo round ya ordenados por createdAt asc. */
export function indexInRound(sameRound: Array<{ id: string }>, id: string): number | null {
  const idx = sameRound.findIndex((m) => m.id === id);
  return idx === -1 ? null : idx + 1; // 1-based
}

/** Dado el índice 1-based del match actual, devuelve a qué match (índice) y lado va su ganador. */
export function nextSlotFor(currentIndex1: number): { nextIndex: number; side: 'A' | 'B' } {
  const nextIndex = Math.ceil(currentIndex1 / 2);
  const side: 'A' | 'B' = currentIndex1 % 2 === 1 ? 'A' : 'B';
  return { nextIndex, side };
}
