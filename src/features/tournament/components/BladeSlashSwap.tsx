'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  showB: boolean;
  renderA: ReactNode;
  renderB: ReactNode;
  angleDeg?: number;
  durationSec?: number;
  afterGlowDelaySec?: number;
  afterGlowDurationSec?: number;
  className?: string;
};

export default function BladeSlashSwap({
  showB,
  renderA,
  renderB,
  angleDeg = 135,
  durationSec = 0.8,
  afterGlowDelaySec = 0.08,
  afterGlowDurationSec = 0.35,
  className,
}: Props) {
  const [shownIsB, setShownIsB] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [glowOn, setGlowOn] = useState(false);

  const mounted = useRef(false);
  const lastShowB = useRef(false);
  const glowTimers = useRef<number[]>([]);

  const slashAngle = useMemo(() => `${angleDeg}deg`, [angleDeg]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setShownIsB(false);
      lastShowB.current = showB;
      return;
    }
    const was = lastShowB.current;
    if (!was && showB && !shownIsB && !animatingOut) {
      setAnimatingOut(true);
      setAnimKey((k) => k + 1);
    }
    lastShowB.current = showB;
  }, [showB, shownIsB, animatingOut]);

  useEffect(() => {
    return () => {
      glowTimers.current.forEach((t) => window.clearTimeout(t));
      glowTimers.current = [];
    };
  }, []);

  const finishSlash = () => {
    setShownIsB(true);
    setAnimatingOut(false);
  };

  return (
    <div className={`relative isolate overflow-hidden ${className ?? ''}`}>
      <div className="relative min-h-[40vh]">
        {shownIsB ? renderB : renderA}

        {shownIsB && glowOn && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              mixBlendMode: 'screen',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(160,200,255,0.35) 45%, rgba(255,255,255,0) 100%)',
              opacity: 0.85,
              maskImage:
                'linear-gradient(90deg, transparent 0%, black 30%, black 70%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0%, black 30%, black 70%, transparent 100%)',
              animation: 'glowSweep 0.5s ease-out forwards',
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {animatingOut && !shownIsB && (
          <motion.div
            key={animKey}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1, transition: { duration: durationSec } }}
            exit={{ opacity: 0 }}
            onAnimationComplete={finishSlash}
            className="absolute inset-0"
          >
            <div
              className="h-full w-full"
              style={{
                maskImage: `linear-gradient(${slashAngle},
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,1) 40%,
                  rgba(0,0,0,0) 50%,
                  rgba(0,0,0,1) 60%,
                  rgba(0,0,0,1) 100%)`,
                WebkitMaskImage: `linear-gradient(${slashAngle},
                  rgba(0,0,0,1) 0%,
                  rgba(0,0,0,1) 40%,
                  rgba(0,0,0,0) 50%,
                  rgba(0,0,0,1) 60%,
                  rgba(0,0,0,1) 100%)`,
                maskSize: '300% 300%',
                WebkitMaskSize: '300% 300%',
                maskPosition: '120% -120%',
                WebkitMaskPosition: '120% -120%',
                animation: `bladeMove ${durationSec}s cubic-bezier(0.2, 0.8, 0.1, 1) forwards`,
                filter: 'drop-shadow(0 0 8px rgba(120,190,255,0.25))',
              }}
            >
              {renderA}

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(${slashAngle},
                    rgba(255,255,255,0) 45%,
                    rgba(180,220,255,0.65) 50%,
                    rgba(255,255,255,0) 55%
                  )`,
                  mixBlendMode: 'screen',
                  opacity: 0.9,
                  animation: `bladeShine ${durationSec}s ease-out forwards`,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes bladeMove {
          0% {
            mask-position: 120% -120%;
            -webkit-mask-position: 120% -120%;
          }
          100% {
            mask-position: -120% 120%;
            -webkit-mask-position: -120% 120%;
          }
        }
        @keyframes bladeShine {
          0% {
            opacity: 0.9;
            filter: blur(0.5px);
          }
          60% {
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            filter: blur(1px);
          }
        }
        @keyframes glowSweep {
          0% {
            transform: translateX(-40%);
            opacity: 0.9;
          }
          100% {
            transform: translateX(40%);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*='animation: bladeMove'] {
            animation: none !important;
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }
          div[style*='animation: bladeShine'],
          div[style*='animation: glowSweep'] {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
