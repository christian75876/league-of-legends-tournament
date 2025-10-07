// services/teams.ts
'use server';

import { wrapServerAction } from '@/utils/server/server-action-error-helper';
import { RegisteredTeam } from '../types/teams.types';
import { ServerActionResult } from '@/types/api.types';
import { listTeamsRaw, TeamWithRels } from '@/repositories/teams.respository';

function toRegisteredTeam(row: TeamWithRels): RegisteredTeam {
  if (!row.captain || !row.captain.email) {
    throw new Error(`Equipo ${row.id} sin email de capitán`);
  }
  const players = row.members.map((m) => m.player.name);

  return {
    id: String(row.id),
    name: row.name,
    captain: row.captain.name,
    email: row.captain.email,
    players: players.slice(0, 5),
    sub: players[5] ?? undefined,
    logoUrl: row.logoUrl ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getTeams(): Promise<ServerActionResult<RegisteredTeam[]>> {
  return wrapServerAction(async () => {
    const rows = await listTeamsRaw();
    const teams = rows.map(toRegisteredTeam);
    return teams;
  });
}
