import type { MatchStatus } from '@prisma/client';

/** Lo que la API devuelve a la UI */
export type MatchDTO = {
  id: string;
  tournamentId: string;
  round: number | null;
  bestOf: number;
  scheduledAt: string | null;
  status: MatchStatus;
  streamUrl: string | null;
  participants: Array<{
    side: 'A' | 'B';
    team: { id: string; name: string; logoUrl?: string | null } | null;
  }>;
  games: Array<{ gameIndex: number; winnerSide: 'A' | 'B' | null; vodUrl: string | null }>;
  score?: { a: number; b: number };
};

export type RoundBucketDTO = {
  round: number;
  matches: MatchDTO[];
};

/** POST /bracket (auto o manual) */
export type GenerateBracketInput =
  | {
      mode: 'auto';
      seedStrategy: 'registrationOrder' | 'random';
      bestOf?: number;
    }
  | {
      mode: 'manual';
      matches: Array<{
        round: number;
        bestOf?: number;
        scheduledAt?: string;
        participants: Array<{ side: 'A' | 'B'; teamId: string }>;
      }>;
    };

/** PATCH /matches/:id */
export type PatchMatchInput = {
  status?: MatchStatus;
  scheduledAt?: string | null;
  bestOf?: number;
  streamUrl?: string;
};

/** POST /matches/:id/report */
export type ReportMatchInput =
  | { winnerSide: 'A' | 'B' } // directo
  | {
      games: Array<{ gameIndex: number; winnerSide: 'A' | 'B'; vodUrl?: string }>;
    }; // granular
