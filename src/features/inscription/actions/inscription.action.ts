// // src/features/inscription/actions/inscription.action.ts
// 'use server';

// import { Prisma } from '@prisma/client';
// import { createTeamFromInscription } from '@/repositories/inscription.repository';
// import { AppError, type ServerActionResult } from '@/types/api.types';
// import { wrapServerAction } from '@/utils/server/server-action-error-helper';
// import { InscriptionFormData } from '../schemas/inscription.schema';

// type Payload = { id: string; name: string };

// export async function submitInscription(
//   input: InscriptionFormData
// ): Promise<ServerActionResult<Payload>> {
//   return wrapServerAction(async () => {
//     // (Opcional) valida aquí con Zod si no lo hiciste antes
//     const team = await createTeamFromInscription(input);
//     return { id: team.id, name: team.name };
//   }).catch((e: unknown) => {
//     if (e instanceof AppError) {
//       return { success: false, error: e.message };
//     }

//     // Prisma errores conocidos
//     if (
//       typeof e === 'object' &&
//       e !== null &&
//       ('code' in e || 'name' in e) &&
//       ((e as Prisma.PrismaClientKnownRequestError).code === 'P1001' ||
//         (e as any).name === 'PrismaClientInitializationError')
//     ) {
//       return { success: false, error: 'No se pudo conectar a la base de datos.' };
//     }

//     if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
//       return { success: false, error: 'Conflicto de unicidad.' };
//     }

//     return { success: false, error: 'No se pudo procesar la inscripción.' };
//   });
// }

'use server';

import { Prisma } from '@prisma/client';
import { createTeamFromInscription } from '@/repositories/inscription.repository';
import { AppError, type ServerActionResult } from '@/types/api.types';
import { wrapServerAction } from '@/utils/server/server-action-error-helper';
import type { InscriptionFormData } from '../schemas/inscription.schema';

type Payload = { id: string; name: string };

// --- ✅ Type guards auxiliares ---
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

export async function submitInscription(
  input: InscriptionFormData
): Promise<ServerActionResult<Payload>> {
  return wrapServerAction(async () => {
    // Validación opcional con Zod si lo deseas:
    // inscriptionFormSchema.parse(input);

    const team = await createTeamFromInscription(input);
    return { id: team.id, name: team.name };
  }).catch((e: unknown) => {
    if (e instanceof AppError) {
      return { success: false, error: e.message };
    }

    // --- ✅ Errores Prisma bien tipados ---
    if (isPrismaConnectionError(e) || isPrismaInitError(e)) {
      return { success: false, error: 'No se pudo conectar a la base de datos.' };
    }

    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { success: false, error: 'Conflicto de unicidad.' };
    }

    return { success: false, error: 'No se pudo procesar la inscripción.' };
  });
}
