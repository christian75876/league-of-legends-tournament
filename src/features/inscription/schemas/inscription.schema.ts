// features/inscription/schemas/inscription.schema.ts
import { z } from 'zod';

export const participantSchema = z.object({
  summonerName: z.string().min(3, 'Mínimo 3 caracteres'),
  riotId: z.string().optional(),
});

export const inscriptionFormSchema = z.object({
  teamName: z.string().min(3, 'Nombre del equipo demasiado corto'),
  captain: z.string().min(3, 'Nombre del capitán demasiado corto'),
  contactEmail: z.string().email('Email inválido'),
  participants: z.array(participantSchema).length(5, 'Deben ser exactamente 5 jugadores'),
});

export type InscriptionFormData = z.infer<typeof inscriptionFormSchema>;

export const DEFAULT_PARTICIPANTS: InscriptionFormData['participants'] = Array.from(
  { length: 5 },
  () => ({ summonerName: '', riotId: '' })
);
