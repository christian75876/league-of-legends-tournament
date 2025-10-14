import LiveContainer from '@/features/live/container/LiveContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'En Vivo',
  description: 'Transmisiones en vivo de los partidos y el chat de la comunidad.',
  openGraph: {
    url: '/live',
    title: 'Partidos en Vivo',
    description: 'Mira el torneo en directo y participa en el chat.',
    images: [{ url: '/android-chrome-512x512.png' }], // luego: '/og/live.jpg'
  },
  twitter: {
    title: 'Partidos en Vivo',
    description: 'Sigue el torneo en directo.',
    images: ['/android-chrome-512x512.png'], // luego: '/og/live.jpg'
  },
  alternates: { canonical: '/live' },
};

export default function LivePAge() {
  return <LiveContainer />;
}
