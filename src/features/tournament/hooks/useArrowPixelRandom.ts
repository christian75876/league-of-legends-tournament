'use client';

import { useEffect, useState } from 'react';

export type UsePixelTwinkleOptions = {
  tickMs?: number;
  changeCount?: number;
  palette?: string[];
  initialColor?: string;
};

const DEFAULT_PALETTE = [
  '#00FFB3',
  '#00E5FF',
  '#0085FF',
  '#5B8CFF',
  '#8A2BE2',
  '#C026D3',
  '#FF2E97',
  '#FF6B6B',
  '#FF8A00',
  '#FFD700',
  '#A3FF00',
  '#7CFC00',
  '#B3FFFD',
  '#FFFFFF',
];

export function usePixelTwinkle(
  pixelCount: number,
  {
    tickMs = 200,
    changeCount = 4,
    palette = DEFAULT_PALETTE,
    initialColor = palette[0],
  }: UsePixelTwinkleOptions = {}
) {
  const [colors, setColors] = useState<string[]>(() => Array(pixelCount).fill(initialColor));

  useEffect(() => {
    setColors(
      Array.from({ length: pixelCount }, () => palette[Math.floor(Math.random() * palette.length)])
    );

    const id = setInterval(() => {
      setColors((prev) => {
        const next = prev.slice();
        for (let i = 0; i < changeCount; i++) {
          const idx = Math.floor(Math.random() * next.length);
          next[idx] = palette[Math.floor(Math.random() * palette.length)];
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(id);
  }, [pixelCount, tickMs, changeCount, palette]);

  return colors;
}
