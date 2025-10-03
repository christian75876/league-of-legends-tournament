// components/StandingsTable.tsx
'use client';

import React, { useMemo, useState } from 'react';

export type TeamStanding = {
  team: string;
  wins: number;
  losses: number;
  ties?: number; // opcional, por si manejas empates
  scored: number; // puntos a favor
  against: number; // puntos en contra
  streak?: string; // ej: 'W3' / 'L2'
};

type Props = {
  data: TeamStanding[];
  /** cuántos clasifican directo (para pintar badges). Ej: 4 */
  topQualifies?: number;
  className?: string;
};

type SortKey = 'rank' | 'team' | 'wins' | 'losses' | 'pct' | 'diff' | 'scored' | 'against';

export default function StandingsTable({ data, topQualifies = 4, className = '' }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const rows = useMemo(() => {
    const enriched = data.map((t) => {
      const played = t.wins + t.losses + (t.ties ?? 0);
      const pct = played > 0 ? (t.wins + (t.ties ?? 0) * 0.5) / played : 0;
      const diff = t.scored - t.against;
      return { ...t, played, pct, diff };
    });

    // ranking por defecto: % victorias, diff, scored
    const ranked = [...enriched].sort((a, b) => {
      if (b.pct !== a.pct) return b.pct - a.pct;
      if (b.diff !== a.diff) return b.diff - a.diff;
      if (b.scored !== a.scored) return b.scored - a.scored;
      return a.team.localeCompare(b.team);
    });

    // aplicar sort elegido por usuario
    const sorted = [...ranked].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortKey) {
        case 'rank':
          // mantiene ranking base, solo invierte si desc
          return dir * 0; // no reordena
        case 'team':
          return dir * a.team.localeCompare(b.team);
        case 'wins':
          return dir * (a.wins - b.wins);
        case 'losses':
          return dir * (a.losses - b.losses);
        case 'pct':
          return dir * (a.pct - b.pct);
        case 'diff':
          return dir * (a.diff - b.diff);
        case 'scored':
          return dir * (a.scored - b.scored);
        case 'against':
          return dir * (a.against - b.against);
        default:
          return 0;
      }
    });

    // asignar rank visual (1..n) según ranking base
    const indexByTeam = new Map(ranked.map((t, i) => [t.team, i + 1]));
    return sorted.map((t) => ({ ...t, rank: indexByTeam.get(t.team) ?? 0 }));
  }, [data, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'rank' ? 'asc' : 'desc'); // rank asc por defecto, números desc en otros
    }
  };

  const th = (label: string, key: SortKey, align: 'left' | 'center' | 'right' = 'left') => {
    const active = sortKey === key;
    const arrow = active ? (sortDir === 'asc' ? '▲' : '▼') : '◇';

    const alignCls =
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

    return (
      <th
        scope="col"
        className={[
          'px-3 py-3 text-xs font-semibold uppercase tracking-wider',
          'text-black/70 dark:text-white/70',
          alignCls,
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() => handleSort(key)}
          className={[
            'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5',
            'transition hover:bg-black/5 focus:outline-none dark:hover:bg-white/10',
            'focus-visible:ring-2 focus-visible:ring-emerald-400/70',
          ].join(' ')}
        >
          <span>{label}</span>
          <span className="text-[10px] opacity-70">{arrow}</span>
        </button>
      </th>
    );
  };

  return (
    <div className={['relative', className].join(' ')}>
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/90 shadow-sm dark:border-white/10 dark:bg-white/[0.06]">
        <div className="max-h-[65vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm dark:bg-neutral-900/70">
              <tr>
                {th('#', 'rank', 'right')}
                {th('Equipo', 'team')}
                {th('PJ', 'rank', 'center')}
                {th('PG', 'wins', 'center')}
                {th('PP', 'losses', 'center')}
                {th('Pct', 'pct', 'center')}
                {th('+/-', 'diff', 'center')}
                {th('GF', 'scored', 'center')}
                {th('GC', 'against', 'center')}
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70">
                  Racha
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const qualifies = t.rank <= topQualifies;
                return (
                  <tr
                    key={t.team}
                    className="border-t border-black/5 hover:bg-black/[0.035] dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <td className="px-3 py-3 text-right tabular-nums">
                      <RankBadge n={t.rank} highlight={qualifies} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          aria-hidden
                          className={[
                            'h-7 w-7 shrink-0 rounded-lg',
                            'bg-gradient-to-br from-emerald-300/60 to-emerald-500/50',
                            'ring-1 ring-emerald-400/40',
                          ].join(' ')}
                        />
                        <span className="font-semibold">{t.team}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center tabular-nums">{t.played}</td>
                    <td className="px-3 py-3 text-center tabular-nums">{t.wins}</td>
                    <td className="px-3 py-3 text-center tabular-nums">{t.losses}</td>
                    <td className="px-3 py-3 text-center tabular-nums">
                      {(t.pct * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-center tabular-nums">
                      <DiffBadge diff={t.diff} />
                    </td>
                    <td className="px-3 py-3 text-center tabular-nums">{t.scored}</td>
                    <td className="px-3 py-3 text-center tabular-nums">{t.against}</td>
                    <td className="px-3 py-3 text-center">
                      <StreakBadge streak={t.streak} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Leyenda / nota */}
        <div className="border-t border-black/10 p-3 text-xs opacity-70 dark:border-white/10">
          <span className="mr-2">★</span>
          <span>
            Los primeros <strong>{topQualifies}</strong> clasifican de forma directa.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function RankBadge({ n, highlight }: { n: number; highlight?: boolean }) {
  return (
    <span
      className={[
        'inline-flex h-7 min-w-[2rem] items-center justify-center rounded-lg px-2 text-xs font-bold tabular-nums',
        highlight
          ? 'bg-emerald-500 text-black ring-1 ring-emerald-400/60'
          : 'bg-black/[0.06] text-black/80 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/80 dark:ring-white/10',
      ].join(' ')}
    >
      {n}
    </span>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  const pos = diff > 0;
  const zero = diff === 0;
  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums',
        pos
          ? 'bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-400/50 dark:text-emerald-300'
          : zero
            ? 'bg-black/10 text-black/70 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/70 dark:ring-white/10'
            : 'bg-rose-500/20 text-rose-700 ring-1 ring-rose-400/50 dark:text-rose-300',
      ].join(' ')}
    >
      {pos ? '+' : ''}
      {diff}
    </span>
  );
}

function StreakBadge({ streak }: { streak?: string }) {
  if (!streak) return <span className="opacity-50">—</span>;
  const positive = streak.startsWith('W');
  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold',
        positive
          ? 'bg-emerald-500/20 text-emerald-700 ring-1 ring-emerald-400/50 dark:text-emerald-300'
          : 'bg-amber-500/20 text-amber-700 ring-1 ring-amber-400/50 dark:text-amber-300',
      ].join(' ')}
      title={`Racha: ${streak}`}
    >
      {streak}
    </span>
  );
}
