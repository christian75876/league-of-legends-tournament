// src/repositories/inscription.repository.ts
import { prisma } from '@/lib/db';
import type { InscriptionFormData } from '@/features/inscription/schemas/inscription.schema';
import { AppError } from '@/types/api.types';

export async function createTeamFromInscription(input: InscriptionFormData) {
  const { teamName, captain, contactEmail, participants } = input;

  // Guardas defensivas (Zod ya valida, pero por si llega algo mal)
  if (participants.length < 5 || participants.length > 6) {
    throw new AppError(
      'INVALID_ROSTER_SIZE',
      'La inscripción debe tener 5–6 jugadores (capitán incluido)'
    );
  }

  // Si esperas Riot ID obligatorio en server (aunque no esté en tu modelo aún):
  const missingRiotIdx = participants.findIndex((p) => !p.riotId?.trim());
  if (missingRiotIdx !== -1) {
    throw new AppError('RIOT_ID_EMPTY', 'Faltan Riot ID en los participantes', {
      [`participants.${missingRiotIdx}.riotId`]: 'Riot ID requerido',
    });
  }

  return prisma.$transaction(async (tx) => {
    // Equipo único por nombre (si mantienes la restricción global por ahora)
    const existingTeam = await tx.team.findUnique({ where: { name: teamName } });
    if (existingTeam) {
      throw new AppError('TEAM_NAME_TAKEN', 'Ya existe un equipo con ese nombre', {
        teamName: 'Ya existe un equipo con ese nombre.',
      });
    }

    // Capitán: upsert por email (si viene). Si no, crea por nombre (nombre NO es único).
    const captainPlayer = contactEmail
      ? await tx.player.upsert({
          where: { email: contactEmail },
          update: { name: captain },
          create: { name: captain, email: contactEmail },
          select: { id: true },
        })
      : await (async () => {
          const found = await tx.player.findFirst({
            where: { name: captain },
            select: { id: true },
          });
          return (
            found ?? (await tx.player.create({ data: { name: captain }, select: { id: true } }))
          );
        })();

    // Jugadores: permite nombres repetidos; si existe uno por nombre, úsalo; si no, créalo.
    const participantIds: string[] = [];
    for (const p of participants) {
      const name = p.summonerName.trim();
      const found = await tx.player.findFirst({ where: { name }, select: { id: true } });
      if (found) participantIds.push(found.id);
      else {
        const created = await tx.player.create({ data: { name }, select: { id: true } });
        participantIds.push(created.id);
      }
    }

    const total = 1 + participantIds.length; // capitán + participantes
    if (total < 5 || total > 6) {
      throw new AppError(
        'INVALID_ROSTER_SIZE',
        'La inscripción debe tener 5–6 jugadores (capitán incluido)'
      );
    }

    // Crear Team
    const team = await tx.team.create({
      data: { name: teamName, captainId: captainPlayer.id },
      select: { id: true, name: true },
    });

    // Roles: capitán STARTER; primeros 5 STARTER; 6º (si existe) SUBSTITUTE
    const starters = participantIds.slice(0, 5).map((pid) => ({
      teamId: team.id,
      playerId: pid,
      role: 'STARTER' as const,
    }));
    const substitute = participantIds[5]
      ? [{ teamId: team.id, playerId: participantIds[5], role: 'SUBSTITUTE' as const }]
      : [];

    await tx.teamMember.createMany({
      data: [
        { teamId: team.id, playerId: captainPlayer.id, role: 'STARTER' },
        ...starters,
        ...substitute,
      ],
      skipDuplicates: true,
    });

    // Devuelve el team con relaciones (si lo necesitas así)
    const full = await tx.team.findUnique({
      where: { id: team.id },
      include: { captain: true, members: { include: { player: true } } },
    });

    // `full` no debería ser null tras crear, pero forzamos non-null assertion
    return full!;
  });
}
