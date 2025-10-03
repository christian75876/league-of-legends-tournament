'use client';

import { type NavItem } from '@/common/constants/constants';
import { usePathname } from 'next/navigation';
import { CardNavItems } from './CardNavItems';

type Props = {
  items: NavItem[];
  fullScreen?: boolean;
  className?: string;
};

export default function CenteredNavButtons({ items, fullScreen = true, className = '' }: Props) {
  const pathname = usePathname() || '/';

  return (
    <nav
      aria-label="Navegación principal del torneo"
      className={[
        'w-full',
        fullScreen ? 'min-h-screen' : '',
        'flex items-center justify-center p-6 md:p-10',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'relative w-full max-w-5xl rounded-3xl border',
          'border-white/10 bg-white/60 backdrop-blur-md',
          'shadow-[0_10px_30px_rgba(0,0,0,0.10)]',
          'dark:border-white/10 dark:bg-white/5',
        ].join(' ')}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(16,185,129,0.10),transparent),radial-gradient(800px_300px_at_90%_120%,rgba(59,130,246,0.12),transparent)]"
        />

        <ul className="relative grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          {items.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');

            return (
              <CardNavItems key={href} href={href} label={label} icon={icon} isActive={isActive} />
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
