import React from 'react';
import { TeamStanding } from '../components/StandingsTable';
import StandingsTable from '../components/StandingsTable';

const mockData: TeamStanding[] = [
  { team: 'Dragon Souls', wins: 6, losses: 1, scored: 102, against: 70, streak: 'W3' },
  { team: 'Baron Slayers', wins: 5, losses: 2, scored: 95, against: 81, streak: 'L1' },
  { team: 'Hextech Wolves', wins: 5, losses: 2, scored: 98, against: 84, streak: 'W1' },
  { team: 'Nexus Breakers', wins: 4, losses: 3, scored: 90, against: 86, streak: 'W2' },
  { team: 'Elder Drakes', wins: 3, losses: 4, scored: 80, against: 88, streak: 'L2' },
  { team: 'Rift Heralds', wins: 2, losses: 5, scored: 74, against: 95, streak: 'W1' },
  { team: 'Arcane Mages', wins: 1, losses: 6, scored: 60, against: 99, streak: 'L4' },
];

const PositionContainer = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div
        className={[
          'relative w-full max-w-5xl rounded-3xl border',
          'border-white/10 bg-white/60 backdrop-blur-md',
          'shadow-[0_10px_30px_rgba(0,0,0,0.10)]',
          'dark:border-white/10 dark:bg-white/5',
        ].join(' ')}
      >
        {/* Adorno sutil como el nav/form */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(16,185,129,0.15),transparent),radial-gradient(800px_300px_at_90%_120%,rgba(59,130,246,0.12),transparent)]"
        />

        <section className="relative p-6 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Tabla de posiciones</h1>
            <p className="text-sm opacity-70">Clasificación general del torneo.</p>
          </header>

          <StandingsTable data={mockData} topQualifies={4} />
        </section>
      </div>
    </main>
  );
};

export default PositionContainer;
