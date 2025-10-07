// repositories/teams.repository.ts  (ojo con el typo en "repository")
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// 1) Define el "shape" de la consulta para inferir el tipo exacto del payload
const teamWithRels = Prisma.validator<Prisma.TeamDefaultArgs>()({
  include: {
    captain: {
      select: { id: true, name: true, email: true },
    },
    members: {
      include: {
        player: {
          select: { id: true, name: true },
        },
      },
      orderBy: { joinedAt: 'asc' }, // consistente para 5 titulares + 1 suplente
    },
  },
});

export type TeamWithRels = Prisma.TeamGetPayload<typeof teamWithRels>;

// 2) Implementa la consulta usando ese shape
export async function listTeamsRaw(): Promise<TeamWithRels[]> {
  return prisma.team.findMany({
    ...teamWithRels,
    orderBy: { createdAt: 'desc' },
  });
}
