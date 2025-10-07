// hooks/useScrollTrigger.ts
import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  target?: 'element' | 'window' | 'both';
  resetAfter?: number;
};

export function useScrollTrigger({ target = 'both', resetAfter = 150 }: Options = {}) {
  const ref = useRef<HTMLElement | null>(null); // asigna este ref al contenedor scrollable
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const trigger = useCallback(() => {
    setIsScrolling(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsScrolling(false), resetAfter);
  }, [resetAfter]);

  useEffect(() => {
    const el = ref.current;

    const onScroll = () => trigger();
    const onWheel = () => trigger();
    const onTouchMove = () => trigger();

    if (target === 'element' || target === 'both') {
      if (el) {
        el.addEventListener('scroll', onScroll, { passive: true });
        el.addEventListener('wheel', onWheel, { passive: true }); // trackpad/desktop
        el.addEventListener('touchmove', onTouchMove, { passive: true }); // móviles
      }
    }

    if (target === 'window' || target === 'both') {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('wheel', onWheel, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (el) {
        el.removeEventListener('scroll', onScroll);
        el.removeEventListener('wheel', onWheel);
        el.removeEventListener('touchmove', onTouchMove);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [target, trigger]);

  return { ref, isScrolling };
}
