import type { Metadata } from 'next';
import './globals.css';
import SmokeBackground from '@/features/tournament/components/SmokeBackground';
import '@fontsource/press-start-2p';
import NavGate from '@/components/NavGate';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  metadataBase: new URL('https://EscenaMuerta.co'), //TODO cambiar al dominio corr
  title: {
    default: 'Torneo LoL',
    template: '%s | Torneo LoL',
  },
  description: 'Torneo de League of Legends. Transmisión en vivo, posiciones y más.',
  openGraph: {
    siteName: 'Torneo LoL',
    type: 'website',
    images: ['/og/site-default.jpg'],
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/site-default.jpg'],
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
