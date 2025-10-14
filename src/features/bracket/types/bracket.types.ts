export type MatchStatus = 'PENDING' | 'SCHEDULED' | 'LIVE' | 'COMPLETED';

export type MatchUI = {
  id: string;
  round: number; // 1..N
  bestOf: number; // 1/3/5
  status: MatchStatus;
  scheduledAt?: string;
  A?: { name: string; id?: string } | null;
  B?: { name: string; id?: string } | null;
  score?: { a: number; b: number };
};

export type RoundBucket = { round: number; matches: MatchUI[] };

export type LayoutOptions = {
  cardW: number;
  cardH: number;
  hGap: number; // separación horizontal entre columnas
  vGap: number; // separación vertical entre cards
  padX: number; // padding horizontal del canvas
  padY: number; // padding vertical del canvas
};
