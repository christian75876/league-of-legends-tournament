import { InscriptionFormData } from '@/features/inscription/schemas/inscription.schema';
import { prisma } from '@/lib/db';

/**
 * Crea un Team con su capitán y miembros a partir del formulario de inscripción.
 * Reglas:
 * - 5 titulares + opcional 1 suplente (el sexto se marca como SUBSTITUTE).
 * - Si existe Player por email (capitán) → se usa. Si no hay email, se intenta por nombre.
 * - Para los jugadores se intenta ubicar por email (si existiera en el futuro),
 *   y si no, por nombre (no-único → usa el primero si coincide).
 * - Si existe Team con el mismo name, lanza error.
 * - El riotId del formulario no existe en tu modelo actual: por ahora se IGNORA (TODO: agregar a Player).
 */
export async function createTeamFromInscription(input: InscriptionFormData) {
  const { teamName, captain, contactEmail, participants } = input;

  // ya validado por Zod, pero dejamos guardas
  if (participants.length < 5 || participants.length > 6) {
    throw new Error('Debes registrar 5 jugadores y opcional 1 suplente');
  }

  return await prisma.$transaction(async (tx) => {
    // equipo único por nombre
    const existingTeam = await tx.team.findUnique({ where: { name: teamName } });
    if (existingTeam) throw new Error('Ya existe un equipo con ese nombre');

    // upsert capitán por email (si hay) o crear/buscar por nombre
    let captainPlayer: { id: string };
    if (contactEmail) {
      captainPlayer = await tx.player.upsert({
        where: { email: contactEmail },
        update: { name: captain },
        create: { name: captain, email: contactEmail },
        select: { id: true },
      });
    } else {
      const foundByName = await tx.player.findFirst({
        where: { name: captain },
        select: { id: true },
      });
      captainPlayer =
        foundByName ?? (await tx.player.create({ data: { name: captain }, select: { id: true } }));
    }

    // crear/ubicar jugadores en el mismo orden del array
    const participantIds: string[] = [];
    for (const p of participants) {
      const name = p.summonerName.trim();
      const existing = await tx.player.findFirst({ where: { name }, select: { id: true } });
      if (existing) participantIds.push(existing.id);
      else {
        const created = await tx.player.create({ data: { name }, select: { id: true } });
        participantIds.push(created.id);
      }
    }

    // total = capitán + participantes
    const total = 1 + participantIds.length;
    if (total < 5 || total > 6)
      throw new Error('La inscripción debe tener 5–6 jugadores (capitán incluido)');

    // crear el Team
    const createdTeam = await tx.team.create({
      data: { name: teamName, captainId: captainPlayer.id },
      select: { id: true, name: true },
    });

    // roles: capitán STARTER, primeros 4 participantes STARTER,
    // el 5º participante STARTER si existe, y el 6º (si existe) SUBSTITUTE
    const starters = participantIds
      .slice(0, 5)
      .map((pid) => ({ playerId: pid, role: 'STARTER' as const }));
    const substitute = participantIds[5]
      ? [{ playerId: participantIds[5], role: 'SUBSTITUTE' as const }]
      : [];

    await tx.teamMember.createMany({
      data: [
        { teamId: createdTeam.id, playerId: captainPlayer.id, role: 'STARTER' },
        ...starters.map((s) => ({ teamId: createdTeam.id, ...s })),
        ...substitute.map((s) => ({ teamId: createdTeam.id, ...s })),
      ],
      skipDuplicates: true, // por si algún Player coincide (no debería gracias al schema)
    });

    return await tx.team
      .findUnique({
        where: { id: createdTeam.id },
        include: { captain: true, members: { include: { player: true } } },
      })
      .then((r) => r!);
  });
}
