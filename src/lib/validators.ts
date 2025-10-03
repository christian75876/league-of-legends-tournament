import { z } from "zod";
export const CreatePlayer = z.object({ name: z.string().min(2), email: z.string().email().optional(), discord: z.string().optional(), rolePreference: z.string().optional() });
export const CreateTeam = z.object({ name: z.string().min(3), captainId: z.string().cuid(), memberIds: z.array(z.string().cuid()).max(5) });
export const SoloRegister = z.object({ tournamentId: z.string().cuid(), playerId: z.string().cuid(), rolePreference: z.string().optional() });
export const TeamRegister = z.object({ tournamentId: z.string().cuid(), teamId: z.string().cuid() });
