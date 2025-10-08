'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, Search, X, SortDesc } from 'lucide-react';
import { RosterFilter, SortKey } from '../hooks/useTeamsView';
import { Select } from '@/common/components/Select';

type HeadersProps = {
  enableSearch: boolean;
  enableRosterFilter: boolean; // (no usado aquí, pero lo dejo para no romper props)
  query: string;
  onQueryChange: (v: string) => void;
  sortBy: SortKey;
  onSortByChange: (v: SortKey) => void;
  filterRoster: RosterFilter; // (no usado aquí, pero lo dejo para no romper props)
  onFilterRosterChange: (v: RosterFilter) => void; // (no usado)
  resultsLabel?: string;
  onReset?: () => void;
};

const sortOptions: { label: string; value: SortKey }[] = [
  { label: 'Más recientes', value: 'recent' },
  { label: 'Nombre', value: 'name' },
  { label: 'Tamaño del equipo', value: 'size' },
];

const TeamsHeader: React.FC<HeadersProps> = ({
  query,
  onQueryChange,
  sortBy,
  onSortByChange,
  enableSearch,
  resultsLabel,
  onReset,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const showReset = Boolean(onReset) && (query || sortBy !== 'recent');

  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-5">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2">
          {enableSearch && (
            <label className="relative flex w-full max-w-none" aria-label="Buscar equipos">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Buscar por equipo, capitán o jugador…"
                className="h-11 w-full rounded-2xl border border-black/10 bg-white/90 pl-9 pr-9 text-sm text-black shadow-sm outline-none ring-0 placeholder:opacity-60 focus-visible:ring-2 focus-visible:ring-emerald-400/80 dark:border-white/10 dark:bg-white/10 dark:text-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 opacity-70 transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-emerald-400/80"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          )}

          <button
            type="button"
            onClick={() => setShowMobileFilters((v) => !v)}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-black/10 bg-white/90 px-3 text-sm font-medium text-black shadow-sm transition hover:bg-white focus-visible:ring-2 focus-visible:ring-emerald-400/80 sm:hidden dark:border-white/10 dark:bg-white/10 dark:text-white"
            aria-expanded={showMobileFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>

        {!!resultsLabel && (
          <span className="text-xs opacity-70 sm:text-sm" aria-live="polite">
            {resultsLabel}
          </span>
        )}
      </div>

      <div
        className={[
          'grid items-end gap-3',
          showMobileFilters ? 'grid-cols-1' : 'hidden sm:grid sm:grid-cols-2',
        ].join(' ')}
      >
        <div>
          <Select<SortKey>
            label="Ordenar por"
            value={sortBy}
            onChange={(v) => onSortByChange(v)}
            options={sortOptions}
          />
        </div>

        {showReset && (
          <div className="flex sm:justify-end">
            <button
              type="button"
              onClick={() => onReset?.()}
              className="h-11 w-full rounded-2xl border border-black/10 bg-white/90 px-4 text-sm font-semibold text-black shadow-sm transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-emerald-400/80 sm:w-auto dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              Reiniciar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsHeader;
