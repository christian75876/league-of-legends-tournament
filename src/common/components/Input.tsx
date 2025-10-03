import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function InputBase(
  { className = '', ...props },
  ref
) {
  const invalid = props['aria-invalid']
    ? 'ring-red-400/80 focus-visible:ring-red-400'
    : 'ring-emerald-400/70 focus-visible:ring-emerald-400/80';

  return (
    <input
      ref={ref}
      {...props}
      className={[
        'h-11 w-full rounded-2xl border px-4',
        'border-black/10 bg-white/90 text-black',
        'shadow-sm outline-none ring-0 focus-visible:ring-2',
        'placeholder:opacity-60',
        'dark:border-white/10 dark:bg-white/[0.06] dark:text-white',
        invalid,
        className,
      ].join(' ')}
    />
  );
});
