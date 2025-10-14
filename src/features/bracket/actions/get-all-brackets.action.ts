'use server';

import { wrapServerAction } from '@/utils/server/server-action-error-helper';
import type { ServerActionResult } from '@/types/api.types';
import type { RoundBucket } from '@/features/bracket/types/bracket.types';
// import { getAllBrackets } from '@/repositories/breackert/bracket.repository';

export type AllBracketsPayload = Array<{
  tournament: { id: string; name: string; slug: string };
  rounds: RoundBucket[];
}>;

// export async function getAllBracketsAction(): Promise<ServerActionResult<AllBracketsPayload>> {
//   return wrapServerAction(async () => {
//     // const data = await getAllBrackets();
//     return true;
//   });
// }
