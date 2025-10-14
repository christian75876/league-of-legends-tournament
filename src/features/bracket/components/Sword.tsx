'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import swordAnimation from '../../../animations/swords.json';

const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

type Props = {
  size?: number;
  loop?: boolean;
};

const Sword = ({ size = 200, loop = true }: Props) => {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-transparent"
    >
      <Lottie
        play
        loop={loop}
        animationData={swordAnimation}
        style={{ width: size, height: size }}
        renderer="svg"
      />
    </div>
  );
};

export default Sword;
