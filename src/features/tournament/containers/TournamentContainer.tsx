'use client';
import { ClipboardList, PlaySquare, Trophy, Users } from 'lucide-react';
import CenteredNavButtons from '../components/CenteredNavButtons';
import { useScrollTrigger } from '../hooks/useScrollTigger';
import BladeSlashSwap from '../components/BladeSlashSwap';
import Tournamnet from '../components/Tournamnet';
import { NAV_ITEMS } from '@/common/constants/constants';

export const TournamentContainer = () => {
  const { ref, isScrolling } = useScrollTrigger();

  return (
    <div ref={ref}>
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
