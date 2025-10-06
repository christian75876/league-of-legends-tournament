// hooks/useTeamsControls.ts
import { useEffect, useState } from 'react';

export type SortKey = 'name' | 'recent' | 'size';
export type RosterFilter = 'all' | 'exact5' | 'withSub' | 'noSub';

export function useTeamsControls(defaultSort: SortKey = 'recent') {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>(defaultSort);
  const [filterRoster, setFilterRoster] = useState<RosterFilter>('all');

  // debounce para búsqueda más fluida (móvil/desktop)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const reset = () => {
    setQuery('');
    setSortBy('recent');
    setFilterRoster('all');
  };

  return {
    // state
    query,
    debouncedQuery,
    sortBy,
    filterRoster,
    // setters
    setQuery,
    setSortBy,
    setFilterRoster,
    // helpers
    reset,
  };
}
