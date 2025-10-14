'use client';
import * as React from 'react';
import type { RoundBucket } from '@/features/bracket/types/bracket.types';
import { getLatestBracketAction } from '@/features/bracket/actions/get-bracket.action';

type State = {
  loading: boolean;
  error?: string;
  tournament?: { id: string; name: string; slug: string };
  rounds?: RoundBucket[];
};

export function useBracket() {
  const [state, setState] = React.useState<State>({ loading: true });

  const fetchData = React.useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: undefined }));
    const res = await getLatestBracketAction();
    if (!res.success) {
      setState({ loading: false, error: res.error ?? 'No se pudo cargar el bracket' });
      return;
    }
    setState({ loading: false, tournament: res.data!.tournament, rounds: res.data!.rounds });
  }, []);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
