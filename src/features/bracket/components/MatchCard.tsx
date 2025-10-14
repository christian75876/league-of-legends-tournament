import React from 'react';

import { TeamRow } from './TeamRow';
import type { MatchUI } from '../types/bracket.types';
import { statusLabel } from './Status';

type MatchCardProps = { m: MatchUI };

const MatchCard: React.FC<MatchCardProps> = ({ m }) => {
  const aScore = m.score?.a ?? 0;
  const bScore = m.score?.b ?? 0;
  const aWin = m.status === 'COMPLETED' ? aScore > bScore : undefined;
  const bWin = m.status === 'COMPLETED' ? bScore > aScore : undefined;

  return (
    <div className="h-full w-full rounded-2xl bg-black/20 p-3 shadow-inner ring-1 ring-white/10">
      <div className="mb-2 flex items-center justify-between text-[11px] opacity-70 sm:text-xs">
        <span>Ronda-{m.round}</span>
        <span className={m.status === 'LIVE' ? 'text-emerald-400' : ''}>
          {statusLabel(m.status)}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <TeamRow name={m.A?.name} highlight={aWin} />
        <TeamRow name={m.B?.name} highlight={bWin} />
      </div>
    </div>
  );
};

export default MatchCard;
