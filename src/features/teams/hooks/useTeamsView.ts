import { useMemo } from 'react';
import { useTeamsControls } from './useTeamsControls';
import { RegisteredTeam } from '../types/teams.types';

export type SortKey = 'name' | 'recent' | 'size';
export type RosterFilter = 'all' | 'exact5' | 'withSub' | 'noSub';

type Options = {
  enableSearch?: boolean;
  enableRosterFilter?: boolean;
  defaultSort?: SortKey;
};

export function useTeamsView(
  teams: RegisteredTeam[],
  { enableSearch = true, enableRosterFilter = true, defaultSort = 'recent' }: Options = {}
) {
  const {
    query,
    debouncedQuery,
    sortBy,
    filterRoster,
    setQuery,
    setSortBy,
    setFilterRoster,
    reset,
  } = useTeamsControls(defaultSort);

  const visibleTeams = useMemo(() => {
    let list = teams;

    if (enableSearch && debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.captain.toLowerCase().includes(q) ||
          t.players.some((p) => p.toLowerCase().includes(q)) ||
          t.sub?.toLowerCase().includes(q)
      );
    }

    if (enableRosterFilter) {
      list = list.filter((t) => {
        const hasSub = !!t.sub;
        if (filterRoster === 'exact5') return t.players.length === 5 && !hasSub;
        if (filterRoster === 'withSub') return hasSub;
        if (filterRoster === 'noSub') return !hasSub;
        return true;
      });
    }

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') {
        const asz = a.players.length + (a.sub ? 1 : 0);
        const bsz = b.players.length + (b.sub ? 1 : 0);
        return bsz - asz;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [teams, debouncedQuery, sortBy, filterRoster, enableSearch, enableRosterFilter]);

  const totals = useMemo(() => {
    const total = teams.length;
    const withSub = teams.filter((t) => !!t.sub).length;
    const exact5 = teams.filter((t) => t.players.length === 5 && !t.sub).length;
    return { total, withSub, exact5 };
  }, [teams]);

  return {
    query,
    sortBy,
    filterRoster,
    setQuery,
    setSortBy,
    setFilterRoster,
    reset,
    visibleTeams,
    totals,
  };
}
