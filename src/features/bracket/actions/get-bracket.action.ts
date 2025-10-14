'use server';

import { wrapServerAction } from '@/utils/server/server-action-error-helper';
import type { ServerActionResult } from '@/types/api.types';
import type { RoundBucket } from '@/features/bracket/types/bracket.types';
import { getLatestBracket } from '@/repositories/breackert/bracket.repository';

export type LatestBracketPayload = {
  tournament: { id: string; name: string; slug: string };
  rounds: RoundBucket[];
};

export async function getLatestBracketAction(): Promise<ServerActionResult<LatestBracketPayload>> {
  return wrapServerAction(async () => {
    const data = await getLatestBracket();
    return data;
  });
}
