export default function Badge({
  children,
  tone = 'slate',
}: {
  children: React.ReactNode;
  tone?: 'emerald' | 'slate';
}) {
  const cls =
    tone === 'emerald'
      ? 'bg-emerald-500/20 text-emerald-700 ring-emerald-400/50 dark:text-emerald-300'
      : 'bg-black/10 text-black/70 ring-black/10 dark:bg-white/10 dark:text-white/70 dark:ring-white/10';
  return (
    <span
      className={['inline-flex items-center rounded-md px-2 py-0.5 text-[11px] ring-1', cls].join(
        ' '
      )}
    >
      {children}
    </span>
  );
}
