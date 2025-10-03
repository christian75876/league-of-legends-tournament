// components/TeamsGrid.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';

export type RegisteredTeam = {
  id: string;
  name: string;
  captain: string;
  email: string;
  players: string[]; // exactamente 5 titulares
  sub?: string; // suplente opcional
  logoUrl?: string; // opcional
  createdAt: string; // ISO
};

type SortKey = 'name' | 'recent' | 'size';
type RosterFilter = 'all' | 'exact5' | 'withSub' | 'noSub';

type Props = {
  teams: RegisteredTeam[];
  defaultSort?: SortKey;
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
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>(defaultSort);
  const [filterRoster, setFilterRoster] = useState<RosterFilter>('all');

  const filtered = useMemo(() => {
    let list = teams;

    if (enableSearch && query.trim()) {
      const q = query.trim().toLowerCase();
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
        return true; // all
      });
    }

    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') {
        const asz = a.players.length + (a.sub ? 1 : 0);
        const bsz = b.players.length + (b.sub ? 1 : 0);
        return bsz - asz;
      }
      // recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted;
  }, [teams, query, sortBy, filterRoster, enableSearch, enableRosterFilter]);

  return (
    <div className={['relative', className].join(' ')}>
      {/* Controles */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {enableSearch && (
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por equipo, capitán o jugador…"
                className={[
                  'h-11 w-72 rounded-2xl border px-4',
                  'border-black/10 bg-white/90 text-black',
                  'shadow-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-400/80',
                  'placeholder:opacity-60',
                  'dark:border-white/10 dark:bg-white/[0.06] dark:text-white',
                ].join(' ')}
              />
            </div>
          )}

          {enableRosterFilter && (
            <select
              value={filterRoster}
              onChange={(e) => setFilterRoster(e.target.value as RosterFilter)}
              className={[
                'h-11 rounded-2xl border px-4',
                'border-black/10 bg-white/90 text-black',
                'shadow-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-400/80',
                'dark:border-white/10 dark:bg-white/[0.06] dark:text-white',
              ].join(' ')}
              title="Filtro por plantilla"
            >
              <option value="all">Todos</option>
              <option value="exact5">Solo 5 titulares</option>
              <option value="withSub">Con suplente</option>
              <option value="noSub">Sin suplente</option>
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm opacity-70">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className={[
              'h-11 rounded-2xl border px-4',
              'border-black/10 bg-white/90 text-black',
              'shadow-sm outline-none ring-0 focus-visible:ring-2 focus-visible:ring-emerald-400/80',
              'dark:border-white/10 dark:bg-white/[0.06] dark:text-white',
            ].join(' ')}
            title="Ordenar resultados"
          >
            <option value="recent">Más recientes</option>
            <option value="name">Nombre</option>
            <option value="size">Tamaño del roster</option>
          </select>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <ul
        className={[
          'grid gap-3',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          'items-stretch',
        ].join(' ')}
      >
        {filtered.map((t) => (
          <li key={t.id} className="h-full list-none">
            <article
              className={[
                'group relative flex h-full flex-col rounded-2xl border p-4',
                'border-black/10 bg-white/90 shadow-sm',
                'transition hover:-translate-y-0.5 hover:shadow-md',
                'dark:border-white/10 dark:bg-white/[0.06]',
              ].join(' ')}
            >
              {/* Top: logo + nombre */}
              <div className="flex items-center gap-3">
                <TeamAvatar name={t.name} logoUrl={t.logoUrl} />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold">{t.name}</h3>
                  <p className="text-xs opacity-70">
                    Capitán: <span className="font-medium">{t.captain}</span>
                  </p>
                </div>
              </div>

              {/* Body: lista de jugadores */}
              <div className="mt-3 grid gap-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge tone="emerald">
                    {t.players.length} titulares {t.sub ? '+ 1 suplente' : ''}
                  </Badge>
                  <Badge tone="slate">Creado: {new Date(t.createdAt).toLocaleDateString()}</Badge>
                </div>

                <ul className="mt-1 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                  {t.players.map((p) => (
                    <li key={p} className="truncate leading-tight">
                      • {p}
                    </li>
                  ))}
                  {t.sub && (
                    <li className="truncate leading-tight">
                      • <span className="opacity-70">Suplente:</span> {t.sub}
                    </li>
                  )}
                </ul>
              </div>

              {/* Footer: contacto */}
              <div className="mt-auto pt-3">
                <a
                  href={`mailto:${t.email}`}
                  className={[
                    'group/button inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold',
                    'bg-emerald-500 text-black transition hover:opacity-90',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70',
                  ].join(' ')}
                >
                  Contactar
                  <span
                    aria-hidden
                    className="relative -mr-0.5 translate-x-0 opacity-0 transition-all group-hover/button:translate-x-0.5 group-hover/button:opacity-100"
                  >
                    →
                  </span>
                </a>
              </div>

              {/* Halo */}
              <span
                aria-hidden
                className={[
                  'pointer-events-none absolute inset-0 rounded-2xl',
                  'ring-1 ring-inset ring-emerald-300/30',
                  'opacity-0 transition-opacity group-hover:opacity-100',
                ].join(' ')}
              />
            </article>
          </li>
        ))}
      </ul>

      {/* Vacío */}
      {filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 text-center text-sm opacity-70 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
          No se encontraron equipos con los filtros actuales.
        </div>
      )}
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

function TeamAvatar({ name, logoUrl }: { name: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-emerald-400/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`Logo ${name}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
  // Fallback con iniciales
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      aria-hidden
      className={[
        'flex h-10 w-10 items-center justify-center rounded-xl',
        'bg-gradient-to-br from-emerald-300/60 to-emerald-500/50',
        'ring-1 ring-emerald-400/40',
        'text-xs font-bold text-black',
      ].join(' ')}
      title={name}
    >
      {initials}
    </div>
  );
}

function Badge({
  children,
  tone = 'slate',
}: {
  children: React.ReactNode;
  tone?: 'emerald' | 'slate';
}) {
  const cls =
    tone === 'emerald'
      ? 'bg-emerald-500/20 text-emerald-700 ring-emerald-400/50 dark:text-emerald-300'
      : 'bg-black/10 text-black/70 ring-black/10 dark:bg-white/10 dark:text-white/70 dark:ring-white/10';
  return (
    <span
      className={['inline-flex items-center rounded-md px-2 py-0.5 text-[11px] ring-1', cls].join(
        ' '
      )}
    >
      {children}
    </span>
  );
}
