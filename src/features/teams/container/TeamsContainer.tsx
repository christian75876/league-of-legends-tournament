import TeamsGrid, { RegisteredTeam } from '../components/TeamsGrid';

const mockTeams: RegisteredTeam[] = [
  {
    id: 't1',
    name: 'Dragon Souls',
    captain: 'MidMasterCO',
    email: 'captain@dragonsouls.gg',
    players: ['MidMasterCO', 'TopKing', 'JungleFox', 'ADCPro', 'ShieldMaiden'],
    sub: 'ElderBlade', // suplente (opcional)
    logoUrl: '/logos/dragon-souls.png',
    createdAt: '2025-09-20T10:00:00Z',
  },
  {
    id: 't2',
    name: 'Baron Slayers',
    captain: 'SmiteGod',
    email: 'contact@baronslayers.gg',
    players: ['SmiteGod', 'WallBreaker', 'RangerX', 'PrismMage', 'NightCarry'],
    sub: undefined,
    logoUrl: '/logos/baron-slayers.png',
    createdAt: '2025-09-21T14:36:00Z',
  },
  {
    id: 't3',
    name: 'Hextech Wolves',
    captain: 'FrostByte',
    email: 'wolves@hextech.gg',
    players: ['FrostByte', 'NordicTop', 'BlueSmite', 'LaserADC', 'ShieldBot'],
    sub: 'YoungWolf',
    logoUrl: '/logos/hextech-wolves.png',
    createdAt: '2025-09-23T09:12:00Z',
  },
  {
    id: 't4',
    name: 'Nexus Breakers',
    captain: 'TowerDive',
    email: 'info@nexusbreakers.gg',
    players: ['TowerDive', 'IronTop', 'GreenJung', 'CritArc', 'Lantern'],
    sub: undefined,
    logoUrl: '/logos/nexus-breakers.png',
    createdAt: '2025-09-18T19:25:00Z',
  },
];

const TeamsContainer = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div
        className={[
          'relative w-full max-w-5xl rounded-3xl border',
          'border-white/10 bg-white/60 backdrop-blur-md',
          'shadow-[0_10px_30px_rgba(0,0,0,0.10)]',
          'dark:border-white/10 dark:bg-white/5',
        ].join(' ')}
      >
        {/* Adorno sutil como en las otras vistas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(16,185,129,0.15),transparent),radial-gradient(800px_300px_at_90%_120%,rgba(59,130,246,0.12),transparent)]"
        />

        <section className="relative p-6 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Equipos inscritos</h1>
            <p className="text-sm opacity-70">Listado de equipos y su plantilla registrada.</p>
          </header>

          <TeamsGrid teams={mockTeams} defaultSort="recent" enableSearch enableRosterFilter />
        </section>
      </div>
    </main>
  );
};

export default TeamsContainer;
