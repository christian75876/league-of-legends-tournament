import { z } from 'zod';

export const ParticipantSchema = z.object({
  summonerName: z.string().min(2, 'Ingresa el Summoner Name'),
  riotId: z.string().min(3, 'Ingresa el Riot ID'),
});

export const inscriptionFormSchema = z.object({
  teamName: z.string().min(2, 'Ingresa el nombre del equipo'),
  captain: z.string().min(2, 'Ingresa el Summoner del capitán'),
  contactEmail: z.string().email('Email inválido'),
  participants: z
    .array(ParticipantSchema)
    .min(5, 'Debes registrar 5 jugadores')
    .max(6, 'Máximo 6 jugadores (1 suplente)'),
});

export type InscriptionFormData = z.infer<typeof inscriptionFormSchema>;
