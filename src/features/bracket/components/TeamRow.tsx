import React from 'react';

export function TeamRow({ name, highlight }: { name?: string; highlight?: boolean }) {
  const shown = name ?? 'TBD';
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
        highlight
          ? 'border border-emerald-400/40 bg-emerald-500/15'
          : 'border border-white/10 bg-white/5'
      }`}
    >
      <span className="truncate pr-3">{shown}</span>
    </div>
  );
}
