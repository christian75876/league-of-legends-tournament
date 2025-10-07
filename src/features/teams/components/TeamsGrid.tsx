'use client';

import TeamsHeader from './TeamsHeader';
import TeamsCard from './TeamsCard';
import { useTeamsView } from '../hooks/useTeamsView';
import { RegisteredTeam } from '../types/teams.types';

type Props = {
  teams: RegisteredTeam[];
  defaultSort?: 'name' | 'recent' | 'size';
  enableSearch?: boolean;
  enableRosterFilter?: boolean;
  className?: string;
};

export default function TeamsGrid({
  teams,
  defaultSort = 'recent',
  enableSearch = true,
  enableRosterFilter = true,
  className = '',
}: Props) {
  const { query, sortBy, filterRoster, setQuery, setSortBy, setFilterRoster, reset, visibleTeams } =
    useTeamsView(teams, { enableSearch, enableRosterFilter, defaultSort });

  return (
    <div className={['relative', className].join(' ')}>
      <TeamsHeader
        enableSearch={enableSearch}
        enableRosterFilter={enableRosterFilter}
        query={query}
        onQueryChange={setQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        filterRoster={filterRoster}
        onFilterRosterChange={setFilterRoster}
        resultsLabel={`${visibleTeams.length} equipo${visibleTeams.length === 1 ? '' : 's'}`}
        onReset={reset}
      />

      <TeamsCard teams={visibleTeams} />

      {visibleTeams.length === 0 && (
        <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 text-center text-sm opacity-70 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          No se encontraron equipos con los filtros actuales.
        </div>
      )}
    </div>
  );
}




