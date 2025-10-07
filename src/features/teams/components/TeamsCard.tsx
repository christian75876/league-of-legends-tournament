import React from 'react';
import Badge from './TeamBadge';
import TeamAvatar from './TeamsAvatar';
import { RegisteredTeam } from '../types/teams.types';

export type TeamsCardProps = {
  teams: RegisteredTeam[];
};

const TeamsCard: React.FC<TeamsCardProps> = ({ teams }) => {
  return (
    <ul
      className={['grid gap-3', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 'items-stretch'].join(
        ' '
      )}
    >
      {teams.map((t) => (
        <li key={t.id} className="h-full list-none">
          <article
            className={[
              'group relative flex h-full flex-col rounded-2xl border p-4',
              'border-black/10 bg-white/90 shadow-sm',
              'transition hover:-translate-y-0.5 hover:shadow-md',
              'dark:border-white/10 dark:bg-white/[0.06]',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{t.name}</h3>
                <p className="text-xs opacity-70">
                  Capitán: <span className="font-medium">{t.captain}</span>
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge tone="slate">
                  Creado: {new Date(t.createdAt).toLocaleDateString()}
                </Badge>{' '}
              </div>

              <ul className="mt-1 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                {t.players.map((p) => (
                  <li key={p} className="truncate leading-tight">
                    • {p}
                  </li>
                ))}
              </ul>
            </div>

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
  );
};

export default TeamsCard;
