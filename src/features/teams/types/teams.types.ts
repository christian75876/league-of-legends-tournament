export type RegisteredTeam = {
  id: string;
  name: string;
  captain: string;
  email: string;
  players: string[];
  sub?: string;
  logoUrl?: string;
  createdAt: string;
};

export type SortKey = 'name' | 'recent' | 'size';
export type RosterFilter = 'all' | 'exact5' | 'withSub' | 'noSub';
