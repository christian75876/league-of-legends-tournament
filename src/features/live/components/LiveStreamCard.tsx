// components/LiveStreamCard.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

type Props = {
  /** Nombre del canal en Kick, ej: "midmasterco" */
  kickChannel: string;
  /** (Opcional) ID de video de YouTube como respaldo */
  youtubeVideoId?: string;
  /** Mostrar chat embebido al cargar */
  showChatByDefault?: boolean;
  className?: string;
};


const ghostBtn = [
  'inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold',
  'border border-black/10 bg-white/90 shadow-sm',
  // hover consistente
  'transition hover:bg-emerald-500/10 hover:ring-1 hover:ring-emerald-400/40',
  // focus
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70',
  // dark
  'dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-emerald-400/10',
].join(' ');

type Source = 'kick' | 'youtube';

export default function LiveStreamCard({
  kickChannel,
  youtubeVideoId = '',
  showChatByDefault = true,
  className = '',
}: Props) {
  const [source, setSource] = useState<Source>('kick');
  const [showChat, setShowChat] = useState<boolean>(showChatByDefault);
  const hasYouTube = Boolean(youtubeVideoId);

  const kickPlayerSrc = useMemo(
    () => `https://player.kick.com/${encodeURIComponent(kickChannel)}?autoplay=true&muted=true`,
    [kickChannel]
  );

  // Nota: para YT usamos embed estándar
  const ytPlayerSrc = useMemo(
    () =>
      youtubeVideoId
        ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&playsinline=1`
        : '',
    [youtubeVideoId]
  );

  const kickChatSrc = useMemo(
    () => `https://kick.com/${encodeURIComponent(kickChannel)}/chatroom?embed=true`,
    [kickChannel]
  );

  const isKick = source === 'kick';
  const playerSrc = isKick ? kickPlayerSrc : ytPlayerSrc;

  return (
    <div className={['relative', className].join(' ')}>
      {/* Controles superiores */}
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Segmented
            value={source}
            onChange={(v) => setSource(v as Source)}
            options={[
              { value: 'kick', label: 'Kick' },
              ...(hasYouTube ? [{ value: 'youtube', label: 'YouTube' as const }] : []),
            ]}
          />
          <button type="button" onClick={() => setShowChat((s) => !s)} className={ghostBtn}>
            {showChat ? 'Ocultar chat' : 'Mostrar chat'}
          </button>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {isKick && (
            <Link href={`https://kick.com/${kickChannel}`} target="_blank" className={ghostBtn}>
              Abrir en Kick ↗
            </Link>
          )}
          {!isKick && hasYouTube && (
            <Link
              href={`https://youtube.com/watch?v=${youtubeVideoId}`}
              target="_blank"
              className={ghostBtn}
            >
              Abrir en YouTube ↗
            </Link>
          )}
        </div>
      </div>

      {/* Contenedor principal: player + chat */}
      <div
        className={[
          'grid gap-3',
          showChat ? 'grid-cols-1 lg:grid-cols-[1fr_minmax(280px,360px)]' : '',
        ].join(' ')}
      >
        {/* Player */}
        <div
          className={[
            'relative overflow-hidden rounded-2xl border',
            'border-black/10 bg-white/90 shadow-sm',
            'dark:border-white/10 dark:bg-white/[0.06]',
          ].join(' ')}
        >
          <Aspect className="rounded-2xl">
            {playerSrc ? (
              <iframe
                src={playerSrc}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full rounded-2xl"
                title={`Kick: ${kickChannel}`}
              />
            ) : (
              <EmptyState
                title="Sin fuente seleccionada"
                description="Configura tu canal de Kick o un video de YouTube."
              />
            )}
          </Aspect>
        </div>

        {showChat && isKick && (
          <div
            className={[
              'relative rounded-2xl border',
              'border-black/10 bg-white/90 shadow-sm',
              'dark:border-white/10 dark:bg-white/[0.06]',
            ].join(' ')}
          >
            <div className="relative h-[450px] overflow-hidden [clip-path:inset(0_0_72px_0)]">
              <iframe
                src={kickChatSrc}
                className="h-full w-full"
                loading="lazy"
                title={`Chat de ${kickChannel}`}
              />
            </div>

            <div className="pointer-events-auto absolute bottom-16 left-0 right-0 flex h-20 items-center justify-between gap-2 rounded-b-2xl bg-gradient-to-t from-white to-transparent p-2 text-xs dark:from-black">
              <span className="opacity-70">Chat en modo lectura</span>
            </div>
          </div>
        )}
      </div>

      {/* Nota / ayuda */}
      <p className="mt-3 text-xs opacity-70">
        Consejo: si el reproductor no carga embebido, abre el canal directamente en la plataforma.
      </p>
    </div>
  );
}

/* ---------- Helpers UI (estética consistente) ---------- */

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div
      role="tablist"
      className={[
        'inline-flex items-center gap-1 rounded-2xl border p-1',
        'border-black/10 bg-white/90 shadow-sm',
        'dark:border-white/10 dark:bg-white/[0.06]',
      ].join(' ')}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={[
              'min-w-20 rounded-xl px-3 py-1.5 text-sm font-semibold transition',
              active
                ? 'bg-emerald-500 text-black'
                : 'text-black/80 hover:bg-white dark:text-white/80',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Aspect({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={['relative w-full', className].join(' ')}>
      {/* 16:9 */}
      <div className="pt-[56.25%]" />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-2 h-10 w-10 rounded-xl bg-emerald-500/30 ring-1 ring-emerald-400/30" />
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-xs opacity-70">{description}</p>
    </div>
  );
}
