export default function TeamAvatar({ name, logoUrl }: { name: string; logoUrl?: string }) {
  if (logoUrl) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-emerald-400/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`Logo ${name}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      aria-hidden
      className={[
        'flex h-10 w-10 items-center justify-center rounded-xl',
        'bg-gradient-to-br from-emerald-300/60 to-emerald-500/50',
        'ring-1 ring-emerald-400/40',
        'text-xs font-bold text-black',
      ].join(' ')}
      title={name}
    >
      {initials}
    </div>
  );
}
