'use client';
import Image from 'next/image';
import { ArrowPixelRandom } from './ArrowPixelRandom';

const Tournamnet = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Image
        src={'/img/league-of-legends.png'}
        width={383}
        height={230}
        alt="League of Legends"
        priority
      />

      <div className="mb-36 animate-fadeInUp p-4">
        <h1 className="animate-gradient bg-gradient-to-r from-[#00FFB3] via-[#0085FF] via-[#8A2BE2] to-[#FFD700] bg-clip-text text-center text-4xl font-extrabold text-transparent drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]">
          Tournament
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center space-y-16 p-6">
        <p className="animate-bounceCustom text-center text-xs font-light text-gray-400 [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
          ¡Para avanzar swipe up / scroll down!
        </p>
        <ArrowPixelRandom
          size={32}
          tickMs={90}
          changeCount={5}
          className="animate-bounceCustom drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
        />
      </div>
    </div>
  );
};

export default Tournamnet;
