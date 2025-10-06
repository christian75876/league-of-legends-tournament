// src/features/inscription/actions/inscription.action.ts
'use server';

import { Prisma } from '@prisma/client';
import { createTeamFromInscription } from '@/repositories/inscription.repository';
import { AppError, type ServerActionResult } from '@/types/api.types';
import { wrapServerAction } from '@/utils/server/server-action-error-helper';

type Payload = { id: string; name: string };

export async function submitInscription(input: any): Promise<ServerActionResult<Payload>> {
  return wrapServerAction(async () => {
    // (Opcional) valida aquí con Zod si no lo hiciste antes
    const team = await createTeamFromInscription(input);
    return { id: team.id, name: team.name };
  }).catch((e) => {
    // Normaliza errores aquí si quieres enriquecer mensajes
    if (e instanceof AppError) {
      // Puedes loguear `e.code` y `e.fieldErrors`
      return { success: false, error: e.message };
    }
    if ((e as any)?.code === 'P1001' || (e as any)?.name === 'PrismaClientInitializationError') {
      return { success: false, error: 'No se pudo conectar a la base de datos.' };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { success: false, error: 'Conflicto de unicidad.' };
    }
    return { success: false, error: 'No se pudo procesar la inscripción.' };
  });
}
