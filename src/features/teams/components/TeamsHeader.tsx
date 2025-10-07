'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, SortDesc, Search, X } from 'lucide-react';
import { RosterFilter, SortKey } from '../hooks/useTeamsView';
import { Select } from '@/common/components/Select';

type HeadersProps = {
  enableSearch: boolean;
  enableRosterFilter: boolean;
  query: string;
  onQueryChange: (v: string) => void;
  sortBy: SortKey;
  onSortByChange: (v: SortKey) => void;
  filterRoster: RosterFilter;
  onFilterRosterChange: (v: RosterFilter) => void;
  resultsLabel?: string;
  onReset?: () => void;
};

const rosterOptions: { label: string; value: RosterFilter; hint?: string }[] = [
  { label: 'Todos', value: 'all', hint: 'Mostrar todos los equipos' },
  { label: 'Solo 5 titulares', value: 'exact5', hint: 'Sin suplente' },
  { label: 'Con suplente', value: 'withSub', hint: 'Incluye suplente' },
  { label: 'Sin suplente', value: 'noSub', hint: 'Solo titulares' },
];

const sortOptions: { label: string; value: SortKey; hint?: string }[] = [
  { label: 'Más recientes', value: 'recent', hint: 'Orden por fecha de registro' },
  { label: 'Nombre', value: 'name', hint: 'Orden alfabético A–Z' },
  { label: 'Tamaño del roster', value: 'size', hint: 'Más jugadores primero' },
];

const TeamsHeader: React.FC<HeadersProps> = ({
  query,
  onQueryChange,
  sortBy,
  onSortByChange,
  filterRoster,
  onFilterRosterChange,
  enableSearch,
  enableRosterFilter,
  resultsLabel,
  onReset,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const showReset = Boolean(onReset) && (query || filterRoster !== 'all' || sortBy !== 'recent');

  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-5">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2">
          {enableSearch && (
            <label
              className="relative flex w-full max-w-none sm:max-w-md"
              aria-label="Buscar equipos"
            >
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
          'grid grid-cols-1 gap-2 sm:grid-cols-2',
          showMobileFilters ? 'block' : 'hidden sm:grid',
        ].join(' ')}
      >
        <div className="flex items-center gap-2 sm:col-span-2">
          {enableRosterFilter && (
            <div className="w-full">
              <Select<RosterFilter>
                label="Plantilla"
                value={filterRoster}
                onChange={(v) => onFilterRosterChange(v)}
                options={rosterOptions}
              />
              {/* hint debajo */}
              <p className="mt-1 text-xs opacity-70">
                {rosterOptions.find((o) => o.value === filterRoster)?.hint}
              </p>
            </div>
          )}

          {showReset && (
            <button
              type="button"
              onClick={() => onReset?.()}
              className="h-11 shrink-0 rounded-2xl border border-black/10 bg-white/90 px-4 text-sm font-semibold text-black shadow-sm transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-emerald-400/80 dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              Reiniciar filtros
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <label className="hidden text-xs opacity-70 sm:block">Ordenar por:</label>
          <div className="relative">
            <SortDesc className="pointer-events-none absolute right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 opacity-60 sm:block" />
            <div className="w-full">
              <Select<SortKey>
                label="Ordenar por"
                value={sortBy}
                onChange={(v) => onSortByChange(v)}
                options={sortOptions}
                // rightIcon={<SortDesc className="h-4 w-4" />}
              />
              {/* hint debajo */}
              <p className="mt-1 text-xs opacity-70">
                {sortOptions.find((o) => o.value === sortBy)?.hint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsHeader;
