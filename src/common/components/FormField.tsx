import React from 'react';

type FieldProps = {
  label: string;
  error?: string;
  compact?: boolean;
  children: React.ReactNode;
};

export function FormField({ label, error, compact, children }: FieldProps) {
  return (
    <div className={`grid ${compact ? 'gap-1.5' : 'gap-2'}`}>
      <label className="text-sm font-medium opacity-80">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
