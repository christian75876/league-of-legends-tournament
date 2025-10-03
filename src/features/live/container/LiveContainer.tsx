import React from 'react';
import LiveStreamCard from '../components/LiveStreamCard';

const LiveContainer = () => {
  // Ajusta estos valores o usa variables de entorno:
  const kickChannel = process.env.NEXT_PUBLIC_KICK_CHANNEL || 'tu_canal'; // <- cambia por tu canal
  const youtubeVideoId = process.env.NEXT_PUBLIC_YT_VIDEO_ID || ''; // opcional (respaldo)

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
        {/* Adorno radial consistente */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(16,185,129,0.15),transparent),radial-gradient(800px_300px_at_90%_120%,rgba(59,130,246,0.12),transparent)]"
        />

        <section className="relative p-6 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Transmisión en vivo</h1>
            <p className="text-sm opacity-70">Sigue aquí el torneo en directo.</p>
          </header>

          <LiveStreamCard
            kickChannel={kickChannel}
            youtubeVideoId={youtubeVideoId} // déjalo vacío si no usas YouTube
            showChatByDefault
          />
        </section>
      </div>
    </main>
  );
};

export default LiveContainer;
