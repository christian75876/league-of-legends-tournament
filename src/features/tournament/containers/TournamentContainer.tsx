'use client';
import { ClipboardList, PlaySquare, Trophy, Users } from 'lucide-react';
import CenteredNavButtons from '../components/CenteredNavButtons';
import BladeSlashSwap from '../components/BladeSlashSwap';
import Tournamnet from '../components/Tournamnet';
import { NAV_ITEMS } from '@/common/constants/constants';
import { useScrollTrigger } from '../hooks/useScrollTigger';

export const TournamentContainer = () => {
  const { isScrolling } = useScrollTrigger({ target: 'window', resetAfter: 300 });

  return (
    <div className="min-h-screen">
      <BladeSlashSwap
        showB={isScrolling}
        angleDeg={135}
        durationSec={0.8}
        afterGlowDelaySec={0.08}
        afterGlowDurationSec={0.35}
        renderA={<Tournamnet />}
        renderB={<CenteredNavButtons items={NAV_ITEMS} />}
      />
    </div>
  );
};
