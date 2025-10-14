import { toast } from 'sonner';
import { getTeams } from '../actions/getTeams.action';
import TeamsGrid from '../components/TeamsGrid';

export default async function TeamsContainer() {
  const result = await getTeams();

  if (!result.success) {
    toast.error('Error al cargar equipos');
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error al cargar equipos: {result.error}</p>
      </main>
    );
  }

  const teams = result.data;

  return (
    <main className="flex w-full items-center justify-center">
      <div
        className={[
          'relative w-full max-w-5xl rounded-3xl border',
          'border-white/10 bg-white/60 backdrop-blur-md',
          'shadow-[0_10px_30px_rgba(0,0,0,0.10)]',
          'dark:border-white/10 dark:bg-white/5',
        ].join(' ')}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(16,185,129,0.15),transparent),radial-gradient(800px_300px_at_90%_120%,rgba(59,130,246,0.12),transparent)]"
        />

        <section className="relative p-6 sm:p-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Equipos inscritos</h1>
            <p className="text-sm opacity-70">Listado de equipos y su plantilla registrada.</p>
          </header>

          <TeamsGrid teams={teams} defaultSort="recent" enableSearch enableRosterFilter />
        </section>
      </div>
    </main>
  );
}
