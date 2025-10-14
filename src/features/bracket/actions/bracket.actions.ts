'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { wrapServerAction } from '@/utils/server/server-action-error-helper';
import { AppError, type ServerActionResult } from '@/types/api.types';
import {
  GenerateBracketInput,
  MatchDTO,
  PatchMatchInput,
  ReportMatchInput,
  RoundBucketDTO,
} from '@/repositories/breackert/breackert.dto';
import { patchMatch, reportMatch } from '@/repositories/breackert/match.repository';
import { RoundBucket } from '../types/bracket.types';
import { getLatestBracket } from '@/repositories/breackert/bracket.repository';

// ===== Type guards (mismo estilo que en inscripción) =====
function isPrismaInitError(e: unknown): e is { name: string } {
  return (
    typeof e === 'object' &&
    e !== null &&
    'name' in e &&
    (e as { name: string }).name === 'PrismaClientInitializationError'
  );
}
function isPrismaConnectionError(e: unknown): e is { code: string } {
  return (
    typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P1001'
  );
}

// =====================================
// 1) GET bracket
// =====================================
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

// export async function getBracketAction(): Promise<
//   ServerActionResult<{
//     tournament: { id: string; name: string; slug: string };
//     rounds: RoundBucketDTO[];
//     flat?: MatchDTO[];
//   }>
// > {
//   return wrapServerAction(async () => {
//     const data = await getBracket();
//     return data; // { tournament, rounds, flat? }
//   }).catch((e: unknown) => {
//     if (e instanceof AppError) return { success: false, error: e.message };
//     if (isPrismaConnectionError(e) || isPrismaInitError(e)) {
//       return { success: false, error: 'No se pudo conectar a la base de datos.' };
//     }
//     return { success: false, error: 'No se pudo obtener el bracket.' };
//   });
// }

// =====================================
// 2) POST create/generate bracket
// =====================================
// export async function generateBracketAction(
//   slug: string,
//   input: GenerateBracketInput
// ): Promise<ServerActionResult<{ created: number; round: 1 }>> {
//   return wrapServerAction(async () => {
//     const res = await generateBracket(slug, input);
//     // Revalida páginas relacionadas al torneo
//     revalidatePath(`/t/${slug}`);
//     revalidatePath(`/t/${slug}/bracket`);
//     return res; // { created, round: 1 }
//   }).catch((e: unknown) => {
//     if (e instanceof AppError) return { success: false, error: e.message };
//     if (isPrismaConnectionError(e) || isPrismaInitError(e)) {
//       return { success: false, error: 'No se pudo conectar a la base de datos.' };
//     }
//     if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
//       return { success: false, error: 'Conflicto de unicidad.' };
//     }
//     return { success: false, error: 'No se pudo generar el bracket.' };
//   });
// }

// =====================================
// 3) POST report match (games o directo)
// =====================================
export async function reportMatchAction(
  matchId: string,
  body: ReportMatchInput,
  opts?: { slugToRevalidate?: string } // por si quieres revalidar la vista del torneo
): Promise<ServerActionResult<MatchDTO>> {
  return wrapServerAction(async () => {
    const dto = await reportMatch(matchId, body);
    if (opts?.slugToRevalidate) {
      revalidatePath(`/t/${opts.slugToRevalidate}`);
      revalidatePath(`/t/${opts.slugToRevalidate}/bracket`);
    }
    return dto;
  }).catch((e: unknown) => {
    if (e instanceof AppError) return { success: false, error: e.message };
    if (isPrismaConnectionError(e) || isPrismaInitError(e)) {
      return { success: false, error: 'No se pudo conectar a la base de datos.' };
    }
    return { success: false, error: 'No se pudo reportar el resultado.' };
  });
}

// =====================================
// 4) PATCH match (status/agenda/stream/bestOf)
// =====================================
export async function patchMatchAction(
  matchId: string,
  body: PatchMatchInput,
  opts?: { slugToRevalidate?: string }
): Promise<ServerActionResult<MatchDTO>> {
  return wrapServerAction(async () => {
    const dto = await patchMatch(matchId, body);
    if (opts?.slugToRevalidate) {
      revalidatePath(`/t/${opts.slugToRevalidate}`);
      revalidatePath(`/t/${opts.slugToRevalidate}/bracket`);
    }
    return dto;
  }).catch((e: unknown) => {
    if (e instanceof AppError) return { success: false, error: e.message };
    if (isPrismaConnectionError(e) || isPrismaInitError(e)) {
      return { success: false, error: 'No se pudo conectar a la base de datos.' };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { success: false, error: 'Conflicto de unicidad.' };
    }
    return { success: false, error: 'No se pudo actualizar el match.' };
  });
}
