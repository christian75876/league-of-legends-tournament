// src/repositories/breackert/match.repository.ts
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { AppError } from '@/types/api.types';
import { matchWithRels, indexInRound, nextSlotFor } from './repo-helpers';

// Tipos reutilizables (ponlos cerca del repo)
type Side = 'A' | 'B';

type PropagationNone = { propagated: false; next: null };
type PropagationSome = { propagated: true; next: { matchId: string; round: number; side: Side } };
type Propagation = PropagationNone | PropagationSome;

function neededWins(bestOf: number) {
  return Math.floor(bestOf / 2) + 1;
}

function computeFromGames(bestOf: number, games: { winnerSide: string | null }[]) {
  const aWins = games.filter((g) => g.winnerSide === 'A').length;
  const bWins = games.filter((g) => g.winnerSide === 'B').length;
  const need = neededWins(bestOf);
  const winnerSide: Side | null =
    aWins >= need && aWins > bWins ? 'A' : bWins >= need && bWins > aWins ? 'B' : null;
  const completed = Boolean(winnerSide);
  return { aWins, bWins, winnerSide, completed };
}

async function ensureNextMatch(
  tx: Prisma.TransactionClient,
  params: { tournamentId: string; nextRound: number; nextIndex: number; inheritBestOf?: number }
): Promise<string> {
  const { tournamentId, nextRound, nextIndex, inheritBestOf = 1 } = params;
  const existing = await tx.match.findMany({
    where: { tournamentId, round: nextRound },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  if (existing[nextIndex - 1]) return existing[nextIndex - 1].id;

  let lastId: string | null = null;
  for (let i = existing.length; i < nextIndex; i++) {
    const created = await tx.match.create({
      data: { tournamentId, round: nextRound, bestOf: inheritBestOf, status: 'PENDING' },
      select: { id: true },
    });
    lastId = created.id;
  }
  return lastId ?? existing[nextIndex - 1]!.id;
}

async function propagateWinner(
  tx: Prisma.TransactionClient,
  m: { id: string; tournamentId: string; round: number; bestOf: number },
  winnerSide: Side,
  winnerTeamId: string
): Promise<Propagation> {
  const sameRound = await tx.match.findMany({
    where: { tournamentId: m.tournamentId, round: m.round },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });

  const currentIdx = indexInRound(sameRound, m.id);
  if (!currentIdx) {
    return { propagated: false, next: null }; // ✔️ coincide con PropagationNone
  }

  const { nextIndex, side } = nextSlotFor(currentIdx);
  const nextRound = m.round + 1;

  const nextMatchId = await ensureNextMatch(tx, {
    tournamentId: m.tournamentId,
    nextRound,
    nextIndex,
    inheritBestOf: m.bestOf,
  });

  await tx.matchParticipant.upsert({
    where: { matchId_side: { matchId: nextMatchId, side } },
    create: { matchId: nextMatchId, side, teamId: winnerTeamId },
    update: { teamId: winnerTeamId },
  });

  return { propagated: true, next: { matchId: nextMatchId, round: nextRound, side } }; // ✔️ PropagationSome
}

/** Reporte por mapa (gameIndex). Cierra el match al alcanzar el umbral y propaga. */
export async function reportGameAndMaybeClose(
  matchId: string,
  gameIndex: number,
  winnerSide: Side
) {
  const txResult = await prisma.$transaction(async (tx) => {
    const m = await tx.match.findUnique({
      where: { id: matchId },
      include: { participants: true, games: true },
    });
    if (!m) throw new AppError('NOT_FOUND', 'Match no encontrado');
    if (m.round == null) throw new AppError('BAD_REQUEST', 'El match no tiene número de ronda');

    // upsert del game reportado
    await tx.game.upsert({
      where: { matchId_gameIndex: { matchId, gameIndex } },
      update: { winnerSide },
      create: { matchId, gameIndex, winnerSide },
    });

    // recompute
    const games = await tx.game.findMany({ where: { matchId }, orderBy: { gameIndex: 'asc' } });
    const { aWins, bWins, winnerSide: wSide, completed } = computeFromGames(m.bestOf, games);

    if (completed && m.status !== 'COMPLETED') {
      await tx.match.update({ where: { id: m.id }, data: { status: 'COMPLETED' } });
    }

    let propagation: Propagation = { propagated: false, next: null }; // ✔️ ahora es una unión
    if (completed && wSide) {
      const winnerTeamId = m.participants.find((p) => p.side === wSide)?.teamId;
      if (!winnerTeamId) throw new AppError('BAD_REQUEST', 'Participante ganador no válido');
      propagation = await propagateWinner(
        tx,
        { id: m.id, tournamentId: m.tournamentId, round: m.round!, bestOf: m.bestOf },
        wSide,
        winnerTeamId
      );
    }

    return {
      score: { a: aWins, b: bWins },
      winnerSide: wSide,
      completed,
      ...propagation,
    };
  });

  // lectura final para el FE
  const closedMatch = await prisma.match.findUnique({ where: { id: matchId }, ...matchWithRels });
  return { ok: true, ...txResult, closedMatch: closedMatch! };
}

/** Reporte rápido: se rellenan los games mínimos para alcanzar el umbral con winnerSide. */
export async function fastReportWinnerAndPropagate(matchId: string, winnerSide: Side) {
  const txResult = await prisma.$transaction(async (tx) => {
    const m = await tx.match.findUnique({
      where: { id: matchId },
      include: { participants: true, games: true },
    });
    if (!m) throw new AppError('NOT_FOUND', 'Match no encontrado');
    if (m.round == null) throw new AppError('BAD_REQUEST', 'El match no tiene número de ronda');

    const need = neededWins(m.bestOf);

    // Rellena sólo hasta el umbral, respetando games existentes
    let aWins = m.games.filter((g) => g.winnerSide === 'A').length;
    let bWins = m.games.filter((g) => g.winnerSide === 'B').length;

    for (let gi = 1; gi <= m.bestOf; gi++) {
      const existing = m.games.find((g) => g.gameIndex === gi);
      if (existing?.winnerSide) continue;
      if (aWins >= need || bWins >= need) break;

      await tx.game.upsert({
        where: { matchId_gameIndex: { matchId, gameIndex: gi } },
        update: { winnerSide },
        create: { matchId, gameIndex: gi, winnerSide },
      });

      if (winnerSide === 'A') aWins++;
      else bWins++;
    }

    // recompute final
    const games = await tx.game.findMany({ where: { matchId }, orderBy: { gameIndex: 'asc' } });
    const { aWins: A, bWins: B, winnerSide: wSide, completed } = computeFromGames(m.bestOf, games);

    if (completed && m.status !== 'COMPLETED') {
      await tx.match.update({ where: { id: m.id }, data: { status: 'COMPLETED' } });
    }

    const winnerTeamId = m.participants.find((p) => p.side === (wSide ?? winnerSide))?.teamId;
    if (!winnerTeamId) throw new AppError('BAD_REQUEST', 'Participante ganador no válido');

    const propagation = await propagateWinner(
      tx,
      { id: m.id, tournamentId: m.tournamentId, round: m.round!, bestOf: m.bestOf },
      (wSide ?? winnerSide) as Side,
      winnerTeamId
    );

    return {
      score: { a: A, b: B },
      winnerSide: (wSide ?? winnerSide) as Side,
      completed: true,
      ...propagation,
    };
  });

  const closedMatch = await prisma.match.findUnique({ where: { id: matchId }, ...matchWithRels });
  return { ok: true, ...txResult, closedMatch: closedMatch! };
}
