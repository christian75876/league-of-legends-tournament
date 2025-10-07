import { useEffect, useState } from 'react';
import { RosterFilter, SortKey } from './useTeamsView';

export function useTeamsControls(defaultSort: SortKey = 'recent') {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>(defaultSort);
  const [filterRoster, setFilterRoster] = useState<RosterFilter>('all');

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
    query,
    debouncedQuery,
    sortBy,
    filterRoster,
    setQuery,
    setSortBy,
    setFilterRoster,
    reset,
  };
}
