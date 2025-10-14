import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { matchWithRels, toRoundsUI } from './repo-helpers';
import type { RoundBucket } from '@/features/bracket/types/bracket.types';
import { AppError } from '@/types/api.types';

const tournamentWithMatches = Prisma.validator<Prisma.TournamentDefaultArgs>()({
  select: {
    id: true,
    name: true,
    slug: true,
    matches: {
      orderBy: [{ round: 'asc' }, { createdAt: 'asc' }],
      include: matchWithRels.include,
    },
  },
});
export type TournamentWithMatches = Prisma.TournamentGetPayload<typeof tournamentWithMatches>;

export async function getLatestBracket(): Promise<{
  tournament: { id: string; name: string; slug: string };
  rounds: RoundBucket[];
}> {
  const t = await prisma.tournament.findFirst({
    orderBy: { createdAt: 'desc' },
    ...tournamentWithMatches,
  });
  if (!t) throw new AppError('NOT_FOUND', 'No hay torneos');
  return {
    tournament: { id: t.id, name: t.name, slug: t.slug },
    rounds: toRoundsUI(t.matches as any),
  };
}

async function ensureAllTeamsRegistered(tournamentId: string) {
  // Equipos ya inscritos
  const regs = await prisma.teamRegistration.findMany({
    where: { tournamentId },
    select: { teamId: true },
  });
  const already = new Set(regs.map((r) => r.teamId));

  // Todos los equipos existentes
  const teams = await prisma.team.findMany({ select: { id: true } });
  const toRegister = teams.filter((t) => !already.has(t.id));

  if (toRegister.length === 0) return 0;

  // Inscribir los que faltan (status PENDING por defecto)
  await prisma.teamRegistration.createMany({
    data: toRegister.map((t) => ({
      tournamentId,
      teamId: t.id,
      status: 'PENDING',
    })),
    skipDuplicates: true,
  });

  return toRegister.length;
}

export type SeedStrategy = 'registrationOrder' | 'random';
export async function generateFromRegistrations(opts?: {
  slug?: string; // si no viene, usa el torneo más reciente
  seedStrategy?: SeedStrategy; // 'registrationOrder' | 'random'
  bestOf?: number; // default 1
}) {
  const seedStrategy = opts?.seedStrategy ?? 'registrationOrder';
  const bestOf = typeof opts?.bestOf === 'number' ? opts!.bestOf : 1;

  // 1) Seleccionar torneo
  const tournament = opts?.slug
    ? await prisma.tournament.findUnique({
        where: { slug: opts.slug },
        select: { id: true, slug: true },
      })
    : await prisma.tournament.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true, slug: true },
      });

  if (!tournament) throw new AppError('NOT_FOUND', 'No hay torneos');

  return prisma.$transaction(async (tx) => {
    // 2) Evitar duplicar R1
    const existsR1 = await tx.match.findFirst({
      where: { tournamentId: tournament.id, round: 1 },
      select: { id: true },
    });
    if (existsR1) throw new AppError('ALREADY_EXISTS', 'Ya existe bracket de ronda 1');

    // 3) Traer inscripciones. Si no hay, auto-inscribir todos los equipos.
    let regs = await tx.teamRegistration.findMany({
      where: { tournamentId: tournament.id },
      include: { team: { select: { id: true } } },
      orderBy: seedStrategy === 'registrationOrder' ? { createdAt: 'asc' } : undefined,
    });

    if (regs.length < 2) {
      // auto-inscribir todos los equipos
      const added = await ensureAllTeamsRegistered(tournament.id);
      // volver a consultar
      regs = await tx.teamRegistration.findMany({
        where: { tournamentId: tournament.id },
        include: { team: { select: { id: true } } },
        orderBy: seedStrategy === 'registrationOrder' ? { createdAt: 'asc' } : undefined,
      });
      if (regs.length < 2) {
        throw new AppError(
          'NOT_ENOUGH_TEAMS',
          added > 0
            ? 'Se inscribieron equipos automáticamente, pero aún hay menos de 2 equipos.'
            : 'Se requieren al menos 2 equipos para generar el bracket.'
        );
      }
    }

    // 4) IDs sin duplicados
    let teamIds = Array.from(new Set(regs.map((r) => r.team.id)));

    // 5) Shuffle si corresponde
    if (seedStrategy === 'random') {
      for (let i = teamIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [teamIds[i], teamIds[j]] = [teamIds[j], teamIds[i]];
      }
    }

    // 6) Emparejar A vs B
    const pairs: Array<[string, string]> = [];
    for (let i = 0; i < teamIds.length; i += 2) {
      const A = teamIds[i];
      const B = teamIds[i + 1];
      if (!B) break; // impar -> por ahora último queda libre (si quieres BYE lo añadimos luego)
      pairs.push([A, B]);
    }

    // 7) Crear R1
    let created = 0;
    for (const [A, B] of pairs) {
      const match = await tx.match.create({
        data: {
          tournamentId: tournament.id,
          round: 1,
          bestOf,
          status: 'PENDING',
        },
        select: { id: true },
      });

      await tx.matchParticipant.createMany({
        data: [
          { matchId: match.id, side: 'A', teamId: A },
          { matchId: match.id, side: 'B', teamId: B },
        ],
      });

      created++;
    }

    return { created, round: 1 as const, tournament: tournament.slug };
  });
}

export type WinnerSide = 'A' | 'B' | null;

function neededWins(bestOf: number) {
  return Math.floor(bestOf / 2) + 1; // BO1=1, BO3=2, BO5=3...
}

export function computeFromGames(bestOf: number, games: { winnerSide: string | null }[]) {
  const aWins = games.filter((g) => g.winnerSide === 'A').length;
  const bWins = games.filter((g) => g.winnerSide === 'B').length;
  const need = neededWins(bestOf);

  let winnerSide: WinnerSide = null;
  if (aWins >= need && aWins > bWins) winnerSide = 'A';
  if (bWins >= need && bWins > aWins) winnerSide = 'B';

  const completed = Boolean(winnerSide);
  return { aWins, bWins, winnerSide, completed };
}

/**
 * Opcional: registra/actualiza el resultado de un game y,
 * si alguien alcanza el umbral, marca el match como COMPLETED.
 */
export async function recordGameResult(params: {
  matchId: string;
  gameIndex: number; // 1..bestOf
  winnerSide: 'A' | 'B';
}) {
  const { matchId, gameIndex, winnerSide } = params;

  // upsert del game
  await prisma.game.upsert({
    where: { matchId_gameIndex: { matchId, gameIndex } },
    update: { winnerSide },
    create: { matchId, gameIndex, winnerSide },
  });

  // recalc de todo el match
  const match = await prisma.match.findUniqueOrThrow({
    where: { id: matchId },
    include: {
      participants: true,
      games: { orderBy: { gameIndex: 'asc' } },
    },
  });

  const {
    aWins,
    bWins,
    winnerSide: wSide,
    completed,
  } = computeFromGames(match.bestOf, match.games);

  // si llegó al umbral, cerramos el match
  if (completed && match.status !== 'COMPLETED') {
    await prisma.match.update({
      where: { id: matchId },
      data: { status: 'COMPLETED' },
    });
  }

  // devolvemos info derivada, incluyendo el team ganador (útil para propagar a la siguiente ronda)
  const winnerTeamId = wSide
    ? (match.participants.find((p) => p.side === wSide)?.teamId ?? null)
    : null;

  return {
    matchId,
    bestOf: match.bestOf,
    score: { a: aWins, b: bWins },
    winnerSide: wSide as WinnerSide,
    winnerTeamId,
    status: completed ? 'COMPLETED' : match.status,
  };
}
