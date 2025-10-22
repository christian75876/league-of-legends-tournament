import InscriptionContainer from '@/features/inscription/container/InscriptionContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscripción',
  description:
    'Registra tu equipo o inscríbete como jugador libre. Inicio 01/11/2025, sábados y domingos 6–9 pm (GMT-5).',
  openGraph: {
    url: '/inscription',
    title: 'Inscripción al Torneo',
    description:
      'Participa en el torneo de League of Legends — forma tu equipo o únete como jugador libre.',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
  twitter: {
    title: 'Inscripción al Torneo',
    description: 'Forma tu equipo o participa como jugador libre. Cierre 01/11/2025.',
    images: ['/android-chrome-512x512.png'],
  },
  alternates: { canonical: '/inscription' },
};

export default function InscriptionPage() {
  return <InscriptionContainer />;
}
