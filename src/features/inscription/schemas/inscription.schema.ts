import { z } from 'zod';

export const ParticipantSchema = z.object({
  summonerName: z.string().min(2, 'Ingresa el Summoner Name'),
  riotId: z.string().optional().nullable(),
});

export const inscriptionFormSchema = z
  .object({
    teamName: z.string().min(2, 'Ingresa el nombre del equipo'),
    captain: z.string().min(2, 'Ingresa el Summoner del capitán'),
    contactEmail: z.string().email('Email inválido'),
    participants: z
      .array(ParticipantSchema)
      .min(5, 'Debes registrar 5 jugadores')
      .max(6, 'Máximo 6 jugadores (1 suplente)'),
  })
  // todos distintos
  .refine(
    (data) => {
      const names = data.participants.map((p) => p.summonerName.trim().toLowerCase());
      return new Set(names).size === names.length;
    },
    { path: ['participants'], message: 'Cada jugador debe ser distinto' }
  )
  // ninguno igual al capitán
  .refine(
    (data) => {
      const cap = data.captain.trim().toLowerCase();
      return !data.participants.some((p) => p.summonerName.trim().toLowerCase() === cap);
    },
    { path: ['participants'], message: 'El capitán no debe estar en la lista de jugadores' }
  );

export type InscriptionFormData = z.infer<typeof inscriptionFormSchema>;
