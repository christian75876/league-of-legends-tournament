'use server';

import { revalidateTag } from 'next/cache';
import { err, ok, type Result } from '@/lib/utils/result';
import { createTeamFromInscription } from '@/repositories/inscription.repository';
import { InscriptionFormData, inscriptionFormSchema } from '../schemas/inscription.schema';

// export async function submitInscription(
//   input: InscriptionFormData
// ): Promise<Result<{ id: string; name: string }>> {
//   try {
//     const parsed = inscriptionFormSchema.safeParse(input);
//     if (!parsed.success) {
//       return err('Datos de inscripción inválidos');
//     }

//     const team = await createTeamFromInscription(parsed.data);

//     // Si tu listado usa tag de cache, invalídalo
//     revalidateTag('teams:list');

//     return ok({ id: team.id, name: team.name });
//   } catch (e: any) {
//     const message =
//       typeof e?.message === 'string' ? e.message : 'No se pudo procesar la inscripción';
//     return err(message);
//   }
// }

export async function submitInscription(input: InscriptionFormData) {
  console.time('submitInscription');
  console.log('[SA] input', JSON.stringify(input));
  try {
    const team = await createTeamFromInscription(input);
    console.log('[SA] created team', team.id);
    console.timeEnd('submitInscription');
    return ok({ id: team.id, name: team.name });
  } catch (e) {
    console.error('[SA] error', e);
    console.timeEnd('submitInscription');
    return err('No se pudo procesar la inscripción');
  }
}
