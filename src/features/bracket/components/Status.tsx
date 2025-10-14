import { MatchStatus } from '../types/bracket.types';

export function statusLabel(s: MatchStatus) {
  switch (s) {
    case 'PENDING':
      return 'Pendiente';
    case 'SCHEDULED':
      return 'Programado';
    case 'LIVE':
      return 'Live';
    case 'COMPLETED':
      return 'Finalizado';
  }
}
