'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NAV_ITEMS, type NavItem } from '@/common/constants/constants';

type Props = {
  startDate?: string;
  schedule?: string;
  items?: NavItem[];
};

export default function TournamentNav({
  startDate = '12 Oct 2025',
  schedule = 'Sáb/Dom 6–9 pm (GMT-5)',
  items = NAV_ITEMS,
}: Props) {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 -z-10 h-20 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm" />

      <div className="mx-auto mt-3 w-full max-w-6xl px-4">
        <div
          className={[
            'relative flex h-14 items-center justify-between rounded-2xl border px-3 sm:px-4',
            'border-white/10 bg-white/60 backdrop-blur-md',
            'shadow-[0_8px_24px_rgba(0,0,0,0.10)]',
            'dark:border-white/10 dark:bg-white/5',
          ].join(' ')}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(900px_280px_at_10%_-30%,rgba(16,185,129,0.18),transparent),radial-gradient(700px_260px_at_95%_130%,rgba(59,130,246,0.12),transparent)]"
          />

          <Link
            href="/"
            className="relative z-10 ml-1 rounded-xl px-1.5 text-sm font-bold tracking-wide hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
          >
            Torneo LoL
          </Link>

          {/* Desktop nav */}
          <nav className="relative z-10 hidden gap-1.5 md:flex" aria-label="Navegación principal">
            {items.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'group inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-emerald-500 text-black ring-1 ring-emerald-400/60'
                      : 'text-black/80 hover:bg-white/70 dark:text-white/80 dark:hover:bg-white/10',
                  ].join(' ')}
                >
                  {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className={[
              'relative z-10 inline-flex items-center justify-center rounded-xl p-2',
              'text-black/80 hover:bg-white/70',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70',
              'md:hidden',
              'dark:text-white/80 dark:hover:bg-white/10',
            ].join(' ')}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={[
          'mx-auto w-full max-w-6xl px-4',
          'md:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
      >
        <div
          className={[
            'relative mt-2 overflow-hidden rounded-2xl border',
            'border-white/10 bg-white/70 backdrop-blur-md',
            'shadow-[0_8px_24px_rgba(0,0,0,0.10)]',
            'transition-[max-height,opacity] duration-300 ease-out',
            open ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0',
            'dark:border-white/10 dark:bg-white/5',
          ].join(' ')}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(900px_280px_at_10%_-30%,rgba(16,185,129,0.18),transparent),radial-gradient(700px_260px_at_95%_130%,rgba(59,130,246,0.12),transparent)]"
          />

          <nav className="relative grid gap-1 p-2" aria-label="Navegación móvil">
            {items.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'inline-flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-emerald-500 text-black ring-1 ring-emerald-400/60'
                      : 'text-black/80 hover:bg-white/90 dark:text-white/80 dark:hover:bg-white/10',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
                    {label}
                  </span>
                  <span
                    aria-hidden
                    className={[
                      'ml-2 translate-x-0 opacity-0 transition-all',
                      active
                        ? 'opacity-100'
                        : 'group-hover:translate-x-0.5 group-hover:opacity-100',
                    ].join(' ')}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Meta bar */}
      <div className="mx-auto mt-2 w-full max-w-6xl px-4 pb-2">
        <div
          className={[
            'relative flex flex-wrap items-center gap-2 rounded-2xl border px-3 py-2 text-xs',
            'border-white/10 bg-white/60 backdrop-blur-md',
            'shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
            'dark:border-white/10 dark:bg-white/5',
          ].join(' ')}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(800px_200px_at_5%_-30%,rgba(16,185,129,0.12),transparent)]"
          />
          <span className="relative rounded-full bg-emerald-500/20 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-400/40 dark:text-emerald-300">
            Inicio: {startDate}
          </span>
          <span className="relative rounded-full bg-black/10 px-2 py-0.5 text-black/70 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/70 dark:ring-white/10">
            Horarios: {schedule}
          </span>
        </div>
      </div>
    </header>
  );
}
