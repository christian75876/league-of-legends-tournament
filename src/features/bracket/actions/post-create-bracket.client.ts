// src/features/bracket/actions/post-create-bracket.client.ts
'use client';

type SeedStrategy = 'registrationOrder' | 'random';

export async function postCreateBracketClient(opts?: {
  slug?: string;
  seedStrategy?: SeedStrategy;
  bestOf?: number;
}) {
  const res = await fetch('/api/bracket', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      mode: 'auto',
      seedStrategy: 'registrationOrder',
      bestOf: 1,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.error ?? text);
    } catch {
      throw new Error(text);
    }
  }
  return JSON.parse(text) as { created: number; round: 1; tournament: string };
}
