import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

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
      orderBy: { joinedAt: 'asc' },
    },
  },
});

export type TeamWithRels = Prisma.TeamGetPayload<typeof teamWithRels>;

export async function listTeamsRaw(): Promise<TeamWithRels[]> {
  return prisma.team.findMany({
    ...teamWithRels,
    orderBy: { createdAt: 'desc' },
  });
}
