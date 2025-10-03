import InscriptionContainer from '@/features/inscription/container/InscriptionContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscripción',
  description:
    'Inscríbete al Torneo de League of Legends. Equipos de 5–6 jugadores o jugadores libres. Inicio 12/10/2025, sáb-dom 6–9 pm (GMT-5).',
  openGraph: {
    url: '/inscription',
    images: ['/og/inscription.jpg'], //TODO Cambiar las imagenes necesarias para miniaturas
  },
  alternates: { canonical: '/inscription' },
};

export default function InscriptionPage() {
  return <InscriptionContainer />;
}
