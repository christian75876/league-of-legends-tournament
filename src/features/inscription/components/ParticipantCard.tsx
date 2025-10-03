'use client';

import { useFormContext } from 'react-hook-form';
import type { InscriptionFormData } from '../schemas/inscription.schema';
import { FormField } from '../../../common/components/FormField';
import { Input } from '../../../common/components/Input';

type Props = {
  index: number;
};

export function ParticipantCard({ index }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<InscriptionFormData>();

  const pErrors = errors.participants?.[index];

  return (
    <div
      className={[
        'relative grid gap-3 rounded-2xl border p-4',
        'border-black/10 bg-white/90',
        'shadow-sm',
        'dark:border-white/10 dark:bg-white/[0.06]',
      ].join(' ')}
    >
      <span className="text-xs font-medium opacity-70">Jugador {index + 1}</span>

      <FormField label="Summoner Name" error={pErrors?.summonerName?.message} compact>
        <Input
          placeholder={`Jugador ${index + 1}`}
          aria-invalid={!!pErrors?.summonerName}
          {...register(`participants.${index}.summonerName` as const)}
        />
      </FormField>

      <FormField label="Riot ID (opcional)" error={pErrors?.riotId?.message} compact>
        <Input
          placeholder="nombre#1234"
          aria-invalid={!!pErrors?.riotId}
          {...register(`participants.${index}.riotId` as const)}
        />
      </FormField>
    </div>
  );
}
