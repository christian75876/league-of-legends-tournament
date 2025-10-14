'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Check, ChevronUp } from 'lucide-react';

type Option<V extends string = string> = { label: string; value: V };

export function Select<V extends string = string>({
  label,
  value,
  onChange,
  options,
  rightIcon,
  className = '',
}: {
  label: string;
  value: V;
  onChange: (v: V) => void;
  options: Option<V>[];
  rightIcon?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (!btnRef.current?.contains(t) && !listRef.current?.contains(t)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={['w-full', className].join(' ')}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium opacity-70">
        {label}
      </label>

      <button
        id={id}
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between rounded-2xl border border-black/10 bg-white/90 px-4 text-left text-sm text-black shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-400/80 dark:border-white/10 dark:bg-white/10 dark:text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label}</span>
        <span className="ml-2 inline-flex items-center gap-1 opacity-70">
          {rightIcon}
          <span className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}>
            <ChevronDown className="h-4 w-4" />
          </span>{' '}
        </span>
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-black/10 bg-white/60 p-1 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/70"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                role="option"
                aria-selected={active}
                type="button"
                className={[
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm',
                  active
                    ? 'bg-emerald-500/15 font-semibold text-emerald-800 dark:text-emerald-300'
                    : 'hover:bg-black/5 dark:hover:bg-white/10',
                ].join(' ')}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
