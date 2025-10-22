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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    siteName: 'Torneo LoL',
    type: 'website',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Logo Mi Torneo',
      },
    ],
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mi Torneo',
    description: 'Organiza, juega y sigue tus torneos fácilmente.',
    images: ['/icon-512x512.png'],
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
