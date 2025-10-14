// components/bracket/BracketCanvas.tsx
import React from 'react';
import MatchCard from './MatchCard';
import { useBracketLayout } from '../hooks/useBracketLayout';

import { LayoutOptions, RoundBucket } from '../types/bracket.types';
import { useScaleToFit } from '../hooks/useScaleToFit';

type Props = {
  rounds: RoundBucket[];
  options: LayoutOptions;
  mode?: 'scrollX' | 'autoscale';
  maxHeight?: number;
};

export function BracketCanvas({ rounds, options, mode = 'autoscale', maxHeight }: Props) {
  const { width, height, getCardStyle, paths } = useBracketLayout(rounds, options);
  const { ref, scale: calcScale } = useScaleToFit(width, height, { maxHeight });

  const scale = mode === 'autoscale' ? calcScale : 1;

  const paintedHeight = mode === 'autoscale' ? Math.round(height * scale) : height;

  const outerClass =
    mode === 'scrollX' ? 'relative w-full overflow-x-auto' : 'relative w-full overflow-hidden';

  return (
    <div ref={ref} className={outerClass}>
      <div
        className="relative"
        style={{ width: mode === 'scrollX' ? width : '100%', height: paintedHeight }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            minWidth: mode === 'scrollX' ? width : undefined,
          }}
        >
          <svg className="pointer-events-none absolute inset-0" width={width} height={height}>
            {paths.map((p) => (
              <path
                key={p.key}
                d={p.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="text-emerald-400/50"
              />
            ))}
          </svg>

          {rounds.map((col, r) => (
            <React.Fragment key={r}>
              {col.matches.map((m, i) => {
                const style = getCardStyle(r, i);
                return (
                  <div key={m.id} className="absolute" style={style}>
                    <MatchCard m={m} />
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
