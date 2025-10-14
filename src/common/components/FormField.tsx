import React from 'react';

type FieldProps = {
  label: string;
  error?: string;
  compact?: boolean;
  children: React.ReactNode;
};

export function FormField({ label, error, compact, children }: FieldProps) {
  const gap = compact ? 'gap-1.5' : 'gap-2';

  return (
    <div className={`grid ${gap}`}>
      <label className="text-sm font-medium opacity-80">{label}</label>

      {children}

      <div className="h-4">
        <p
          className={`text-xs leading-4 transition-opacity ${
            error ? 'text-red-500 opacity-100' : 'opacity-0'
          }`}
          aria-live="polite"
        >
          {error || '\u00A0'}
        </p>
      </div>
    </div>
  );
}
