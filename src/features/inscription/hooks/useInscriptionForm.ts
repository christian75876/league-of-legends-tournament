// useInscriptionForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  inscriptionFormSchema,
  DEFAULT_PARTICIPANTS,
  type InscriptionFormData,
} from '../schemas/inscription.schema';

export function useInscriptionForm() {
  const methods = useForm<InscriptionFormData>({
    resolver: zodResolver(inscriptionFormSchema),
    mode: 'onChange',
    defaultValues: {
      teamName: '',
      captain: '',
      contactEmail: '',
      participants: DEFAULT_PARTICIPANTS,
    },
  });

  const onSubmit = async (data: InscriptionFormData) => {
    console.log('Inscripción enviada:', data);
  };

  // Devuelve por separado tu onSubmit (no lo mezcles dentro de methods)
  return { methods, onSubmit };
}
