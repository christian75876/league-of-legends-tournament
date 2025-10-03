import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
};

export const CardNavItems: React.FC<NavItem> = ({ href, label, icon: Icon, isActive = false }) => {
  return (
    <li key={href} className="list-none">
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={[
          'group relative flex h-20 w-full items-center justify-start gap-2',
          'rounded-2xl border px-5 py-4',
          'border-black/10 bg-white/90 shadow-sm transition-all',
          'hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70',
          'dark:border-white/10 dark:bg-white/[0.06] dark:text-white',
        ].join(' ')}
      >
        <span
          aria-hidden
          className={[
            'absolute inset-0 rounded-2xl',
            'bg-gradient-to-br from-emerald-200/40 via-emerald-300/20 to-emerald-200/0',
            'opacity-0 transition-opacity',
            isActive ? 'opacity-100' : 'group-hover:opacity-80',
            'dark:from-emerald-400/10 dark:via-emerald-300/5',
          ].join(' ')}
        />
        <span
          aria-hidden
          className={[
            'pointer-events-none absolute inset-0 rounded-2xl',
            'ring-1 ring-inset ring-emerald-300/30',
            isActive ? 'ring-emerald-400/60' : 'group-hover:ring-emerald-300/50',
          ].join(' ')}
        />
        {Icon ? (
          <span
            aria-hidden
            className="translate-y-[0.5px] transition-transform group-hover:scale-[1.06]"
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <span className="relative z-10 block text-sm font-semibold tracking-wide">{label}</span>
      </Link>
    </li>
  );
};
