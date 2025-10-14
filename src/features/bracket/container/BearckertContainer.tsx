'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutOptions, MatchUI } from '../types/bracket.types';
import { useIsMobile } from '@/common/hooks/useIsMobile';
import { BracketCanvas } from '../components/BracketCanvas';
import { useBracket } from '../hooks/useBracket';
import { postCreateBracketClient } from '../actions/post-create-bracket.client';
import Sword from '../components/Sword';

export default function BracketPage() {
  const isMobile = useIsMobile();
  const { loading, error, refetch, tournament, rounds } = useBracket();

  const flatMatches = React.useMemo(
    () => (rounds ? rounds.flatMap((r) => r.matches) : []),
    [rounds]
  );

  async function handleGenerate() {
    try {
      const res = await postCreateBracketClient({
        // slug: 'lol-open', // opcional; si no, toma el más reciente
        seedStrategy: 'registrationOrder',
        bestOf: 1,
      });
      await refetch();
    } catch (e: unknown) {
      console.error(e ?? e);
      alert(e ?? 'No se pudo generar R1');
    }
  }

  const options: LayoutOptions = {
    cardW: 260,
    cardH: 133,
    hGap: 32,
    vGap: 12,
    padX: 9,
    padY: 5,
  };
  if (loading || !rounds || rounds.length === 0) {
    return <Sword />;
  }

  return (
    <main className="flex w-full justify-center">
      <div className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-md sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(900px_300px_at_10%_-10%,rgba(16,185,129,0.15),transparent),radial-gradient(600px_220px_at_90%_120%,rgba(59,130,246,0.12),transparent)]"
        />
        <section className="relative">
          <header className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Cuadro de enfrentamientos
            </h1>
            <Link href="/live" className="text-sm opacity-70 hover:opacity-100">
              Ir al Live
            </Link>
          </header>
          <BracketCanvas
            rounds={rounds}
            options={options}
            mode={isMobile ? 'scrollX' : 'autoscale'}
            maxHeight={isMobile ? undefined : 560}
          />{' '}
        </section>
        {/* <button
          type="button"
          onClick={handleGenerate}
          className="rounded-md border border-white/10 px-3 py-1 text-sm hover:bg-white/10"
        >
          Generar R1 (auto)
        </button> */}
      </div>
    </main>
  );
}
