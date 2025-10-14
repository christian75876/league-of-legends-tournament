// src/hooks/useScaleToFit.ts
import * as React from 'react';

export function useScaleToFit(
  targetWidth: number,
  targetHeight: number,
  opts?: { maxHeight?: number }
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const box = entry.contentRect;
      const scaleX = box.width / targetWidth;
      const scaleY = opts?.maxHeight ? opts.maxHeight / targetHeight : 1;
      const s = Math.min(1, scaleX, scaleY);
      setScale(Number.isFinite(s) && s > 0 ? s : 1);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [targetWidth, targetHeight, opts?.maxHeight]);

  return { ref, scale };
}
