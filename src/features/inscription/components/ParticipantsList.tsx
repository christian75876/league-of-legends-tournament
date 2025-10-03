'use client';

import { useFormContext } from 'react-hook-form';
import type { InscriptionFormData } from '../schemas/inscription.schema';
import { useParticipantsFieldArray } from '../hooks/useParticipantsFieldArray';
import { ParticipantCard } from './ParticipantCard';

export function ParticipantsList() {
  const { control, formState } = useFormContext<InscriptionFormData>();
  const { fields } = useParticipantsFieldArray(control);

  return (
    <section className="grid gap-4">
      <h3 className="text-xl font-semibold">Jugadores (5)</h3>

      <ul className="grid gap-3 sm:grid-cols-2">
        {fields.map((f, idx) => (
          <li key={f.id} className="list-none">
            <ParticipantCard index={idx} />
          </li>
        ))}
      </ul>

      {typeof formState.errors.participants?.message === 'string' && (
        <p className="text-sm text-red-500">{formState.errors.participants.message}</p>
      )}
    </section>
  );
}
