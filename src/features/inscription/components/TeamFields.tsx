'use client';

import { useFormContext } from 'react-hook-form';
import type { InscriptionFormData } from '../schemas/inscription.schema';
import { FormField } from '../../../common/components/FormField';
import { Input } from '../../../common/components/Input';

export function TeamFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InscriptionFormData>();

  return (
    <div className="grid gap-4">
      <FormField label="Nombre del equipo" error={errors.teamName?.message}>
        <Input
          placeholder="Ej: Dragon Souls"
          aria-invalid={!!errors.teamName}
          {...register('teamName')}
        />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Capitán (Summoner Name)" error={errors.captain?.message}>
          <Input
            placeholder="Ej: MidMasterCO"
            aria-invalid={!!errors.captain}
            {...register('captain')}
          />
        </FormField>

        <FormField label="Contacto (email)" error={errors.contactEmail?.message}>
          <Input
            type="email"
            placeholder="tu@email.com"
            aria-invalid={!!errors.contactEmail}
            {...register('contactEmail')}
          />
        </FormField>
      </div>
    </div>
  );
}
