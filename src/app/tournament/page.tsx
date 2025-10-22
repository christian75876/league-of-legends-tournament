import { TournamentContainer } from '@/features/tournament/containers/TournamentContainer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Torneo',
  description: 'Llaves, rondas y resultados del torneo.',
  openGraph: {
    url: '/tournament',
    title: 'Llaves y Resultados',
    description: 'Consulta el bracket, rondas y marcadores.',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
  twitter: {
    title: 'Llaves y Resultados',
    description: 'Bracket y avances del torneo.',
    images: ['/android-chrome-512x512.png'],
  },
  alternates: { canonical: '/tournament' },
};

export default function TournamentPage() {
  return <TournamentContainer />;
}
