import type { Metadata } from 'next';
import './globals.css';
import SmokeBackground from '@/features/tournament/components/SmokeBackground';
import '@fontsource/press-start-2p';
import NavGate from '@/components/NavGate';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  metadataBase: new URL('https://tournamen-league-of-legends.netlify.app'), //TODO cambiar al dominio corr
  title: {
    default: 'Torneo LoL',
    template: '%s | Torneo LoL',
  },
  description: 'Torneo de League of Legends. Transmisión en vivo, posiciones y más.',
  openGraph: {
    siteName: 'Torneo LoL',
    type: 'website',
<<<<<<< Updated upstream
    images: ['/og/site-default.jpg'],
=======
    images: [
      {
        url: '/android-chrome-192x192.png',
        width: 512,
        height: 512,
        alt: 'Logo Mi Torneo',
      },
    ],
>>>>>>> Stashed changes
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
<<<<<<< Updated upstream
    images: ['/og/site-default.jpg'],
=======
    title: 'Mi Torneo',
    description: 'Organiza, juega y sigue tus torneos fácilmente.',
    images: ['/android-chrome-512x512.png'],
>>>>>>> Stashed changes
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased [font-family:'Press_Start_2P']`}>
        <SmokeBackground />
        <NavGate />
        <div className="px-4 sm:p-0">{children}</div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
