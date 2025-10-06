// src/lib/server-action-utils.ts
import type { ServerActionResult } from '@/types/api.types';

/** Helper para devolver error uniforme */
export function handleServerActionError(error: unknown): ServerActionResult<never> {
  // normaliza cualquier tipo de error
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Error desconocido';

  return { success: false, error: message };
}

/**
 * Envuelve una Server Action para manejar errores automáticamente.
 *
 * @example
 * export const createUserAction = wrapServerAction(async () => {
 *   const user = await prisma.user.create(...);
 *   return user;
 * });
 */
export async function wrapServerAction<T>(
  action: () => Promise<T>
): Promise<ServerActionResult<T>> {
  try {
    const result = await action();
    return { success: true, data: result };
  } catch (error) {
    return handleServerActionError(error);
  }
}
