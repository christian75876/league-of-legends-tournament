import { ClipboardList, PlaySquare, Trophy, Users, type LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/inscription', label: 'Inscripción', icon: ClipboardList },
  { href: '/positions', label: 'Tabla de posiciones', icon: Trophy },
  { href: '/live', label: 'Transmisión en vivo', icon: PlaySquare },
  { href: '/teams', label: 'Equipos inscritos', icon: Users },
];
