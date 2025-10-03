'use client';
import { usePathname } from 'next/navigation';
import TournamentNav from './TournamenNAv';

const HIDDEN_ON = new Set<string>(['/tournament']);

export default function NavGate() {
  const pathname = usePathname();

  const hiden = HIDDEN_ON.has(pathname || '');

  if (hiden) return null;
  return <TournamentNav />;
}
