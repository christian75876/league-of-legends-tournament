'use client';

import { FormProvider } from 'react-hook-form';
import { useInscriptionForm } from '../hooks/useInscriptionForm';
import { TeamFields } from './TeamFields';
import { ParticipantsList } from './ParticipantsList';

export default function InscriptionForm() {
  const { methods, onSubmit } = useInscriptionForm();
  const { handleSubmit, formState } = methods;

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(1200px_400px_at_10%_-10%,rgba(16,185,129,0.15),transparent),radial-gradient(800px_300px_at_90%_120%,rgba(59,130,246,0.12),transparent)]"
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="relative grid gap-6 p-6 sm:p-8">
            <header className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Inscripción de equipo</h2>
              <p className="text-sm opacity-70">
                Completa la información del equipo y los 5 jugadores titulares.
              </p>
            </header>

            <TeamFields />
            <ParticipantsList />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!formState.isValid || formState.isSubmitting}
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 disabled:opacity-60"
              >
                <span>{formState.isSubmitting ? 'Enviando…' : 'Enviar inscripción'}</span>
                <span
                  aria-hidden
                  className="relative -mr-1 translate-x-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                >
                  →
                </span>
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
