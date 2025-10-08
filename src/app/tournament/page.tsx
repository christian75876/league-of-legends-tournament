import BrandLoader from '@/common/components/BrandLoader';
import { TournamentContainer } from '@/features/tournament/containers/TournamentContainer';

export const metadata = {
  title: 'Tournament',
  description: 'This is the tournament page',
};

export default function TournamentPage() {
  return <TournamentContainer />;
  // return <BrandLoader />;
}
