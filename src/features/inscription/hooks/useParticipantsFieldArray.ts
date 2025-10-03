// features/inscription/hooks/useParticipantsFieldArray.ts
'use client';

import { useFieldArray, type Control } from 'react-hook-form';
import type { InscriptionFormData } from '../schemas/inscription.schema';

export function useParticipantsFieldArray(control: Control<InscriptionFormData>) {
  const fieldArray = useFieldArray({
    control,
    name: 'participants',
  });

  return fieldArray;
}
