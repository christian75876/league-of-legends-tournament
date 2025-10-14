import { useMemo } from 'react';
import { LayoutOptions, RoundBucket } from '../types/bracket.types';

export function useBracketLayout(rounds: RoundBucket[], opt: LayoutOptions) {
  const { cardW, cardH, hGap, vGap, padX, padY } = opt;

  const colW = cardW + hGap;
  const step1 = cardH + vGap;
  const minGap = 8;

  return useMemo(() => {
    const roundsCount = rounds.length;
    const r1Count = rounds[0]?.matches.length ?? 0;

    const centers: number[][] = [];
    centers[0] = Array.from({ length: r1Count }, (_, i) => padY + i * step1 + cardH / 2);

    for (let r = 1; r < roundsCount; r++) {
      const prev = centers[r - 1];
      const nextLen = rounds[r].matches.length;
      const next: number[] = [];
      for (let j = 0; j < nextLen; j++) {
        const a = prev[j * 2];
        const b = prev[j * 2 + 1];
        next.push((a + b) / 2);
      }
      centers[r] = next;
    }

    for (let r = 0; r < centers.length; r++) {
      const c = centers[r];
      for (let i = 1; i < c.length; i++) {
        const prevCenter = c[i - 1];
        const currCenter = c[i];
        const minDist = cardH + minGap;
        if (currCenter - prevCenter < minDist) {
          const delta = minDist - (currCenter - prevCenter);
          for (let k = i; k < c.length; k++) c[k] += delta;
        }
      }
    }

    const lastRound = centers[centers.length - 1];
    const bottomMost = Math.max(...centers.map((c) => c[c.length - 1] + cardH / 2));
    const height = Math.max(bottomMost + padY, padY * 2 + cardH);

    const width = padX * 2 + roundsCount * colW;

    // paths
    const paths: { d: string; key: string }[] = [];
    for (let r = 0; r < roundsCount - 1; r++) {
      for (let i = 0; i < rounds[r].matches.length; i++) {
        const fromX = padX + r * colW + cardW;
        const fromY = centers[r][i];
        const toIndex = Math.floor(i / 2);
        const toX = padX + (r + 1) * colW;
        const toY = centers[r + 1][toIndex];
        const c = Math.max(32, hGap * 0.6);
        const d = `M ${fromX} ${fromY} C ${fromX + c} ${fromY}, ${toX - c} ${toY}, ${toX} ${toY}`;
        paths.push({ d, key: `${r}-${i}` });
      }
    }

    const getCardStyle = (r: number, i: number) => {
      const left = padX + r * colW;
      const top = centers[r][i] - cardH / 2;
      return { left, top, width: cardW, height: cardH };
    };

    return { width, height, centers, colW, step1, getCardStyle, paths };
  }, [rounds, cardW, cardH, hGap, vGap, padX, padY, colW, step1]);
}
