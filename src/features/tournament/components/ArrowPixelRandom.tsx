'use client';
import React from 'react';
import { usePixelTwinkle } from '../hooks/useArrowPixelRandom';

type Pixel = { x: number; y: number; w?: number; h?: number };

const PIXELS: Pixel[] = [
  { x: 3, y: 2 },
  { x: 3, y: 4 },
  { x: 3, y: 5 },
  { x: 3, y: 6 },
  { x: 5, y: 2 },
  { x: 0, y: 3 },
  { x: 3, y: 3 },
  { x: 6, y: 3 },
  { x: 3, y: 0 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
  { x: 4, y: 1 },
  { x: 1, y: 2 },
];

export function ArrowPixelRandom({
  size = 32,
  tickMs = 200,
  changeCount = 4,
  palette,
  className = '',
}: {
  size?: number;
  tickMs?: number;
  changeCount?: number;
  palette?: string[];
  className?: string;
}) {
  const colors = usePixelTwinkle(PIXELS.length, { tickMs, changeCount, palette });

  return (
    <svg viewBox="0 0 7 7" width={size} height={size} className={className} aria-hidden>
      {PIXELS.map((p, i) => (
        <rect
          key={`${p.x}-${p.y}-${i}`}
          x={p.x}
          y={p.y}
          width={p.w ?? 1}
          height={p.h ?? 1}
          fill={colors[i]}
          shapeRendering="crispEdges"
        />
      ))}
    </svg>
  );
}
