import TeamsContainer from '@/features/teams/container/TeamsContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Equipos',
  description: 'Explora los equipos inscritos, capitanes y jugadores.',
  openGraph: {
    url: '/teams',
    title: 'Equipos del Torneo',
    description: 'Listado de equipos y plantillas.',
    images: [{ url: '/android-chrome-512x512.png' }],
  },
  twitter: {
    title: 'Equipos del Torneo',
    description: 'Revisa plantillas y capitanes.',
    images: ['/android-chrome-512x512.png'],
  },
  alternates: { canonical: '/teams' },
};

export default function TeamsPage() {
  return <TeamsContainer />;
}
