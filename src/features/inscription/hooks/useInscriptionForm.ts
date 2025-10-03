'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InscriptionFormData, inscriptionFormSchema } from '../schemas/inscription.schema';
import { submitInscription } from '../actions/inscription.action';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function useInscriptionForm() {
  // default de 5 jugadores
  const defaultValues = useMemo<InscriptionFormData>(
    () => ({
      teamName: '',
      captain: '',
      contactEmail: '',
      participants: Array.from({ length: 5 }).map(() => ({
        summonerName: '',
        riotId: '',
      })),
    }),
    []
  );

  const methods = useForm<InscriptionFormData>({
    mode: 'onChange', // para habilitar isValid al escribir
    resolver: zodResolver(inscriptionFormSchema),
    defaultValues,
  });

  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<InscriptionFormData> = useCallback(
    async (values) => {
      setStatus('submitting');
      setServerError(null);

      const res = await submitInscription(values);

      if (res.ok) {
        setStatus('success');
        methods.reset(defaultValues); // limpia form
      } else {
        setStatus('error');
        setServerError(res.error ?? 'Error desconocido');
      }
    },
    [methods, defaultValues]
  );

  return { methods, onSubmit, status, serverError };
}
