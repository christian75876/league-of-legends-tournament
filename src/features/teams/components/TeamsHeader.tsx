'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, SortDesc, Search, X } from 'lucide-react';
import type { SortKey, RosterFilter } from '../hooks/useTeamsControls';

type HeadersProps = {
  enableSearch: boolean;
  enableRosterFilter: boolean;
  query: string;
  onQueryChange: (v: string) => void;
  sortBy: SortKey;
  onSortByChange: (v: SortKey) => void;
  filterRoster: RosterFilter;
  onFilterRosterChange: (v: RosterFilter) => void;
  resultsLabel?: string; // opcional: “12 equipos”
  onReset?: () => void; // opcional: muestra botón si existe y hay cambios
};

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
      {/* fila superior: búsqueda + toggle filtros móvil + contador */}
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

          {/* Filtros en móvil */}
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

      {/* fila de filtros + orden (colapsable en móvil) */}
      <div
        className={[
          'grid grid-cols-1 gap-2 sm:grid-cols-2',
          showMobileFilters ? 'block' : 'hidden sm:grid',
        ].join(' ')}
      >
        <div className="flex items-center gap-2 sm:col-span-2">
          {enableRosterFilter && (
            <select
              value={filterRoster}
              onChange={(e) => onFilterRosterChange(e.target.value as RosterFilter)}
              className="h-11 w-full rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-black shadow-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-400/80 dark:border-white/10 dark:bg-white/10 dark:text-white"
              title="Filtro por plantilla"
            >
              <option value="all">Todos</option>
              <option value="exact5">Solo 5 titulares</option>
              <option value="withSub">Con suplente</option>
              <option value="noSub">Sin suplente</option>
            </select>
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
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortKey)}
              className="h-11 w-full min-w-[12rem] rounded-2xl border border-black/10 bg-white/90 px-4 text-sm text-black shadow-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-400/80 dark:border-white/10 dark:bg-white/10 dark:text-white"
              title="Ordenar resultados"
            >
              <option value="recent">Más recientes</option>
              <option value="name">Nombre</option>
              <option value="size">Tamaño del roster</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsHeader;
