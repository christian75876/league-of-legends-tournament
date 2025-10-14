// src/app/api/matches/[id]/report/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from '@/types/api.types';
import {
  fastReportWinnerAndPropagate,
  reportGameAndMaybeClose,
} from '@/repositories/breackert/match.repository';

const BodySchema = z.union([
  z.object({ winnerSide: z.enum(['A', 'B']) }), // reporte rápido (BO1 típico)
  z.object({ gameIndex: z.number().int().min(1), winnerSide: z.enum(['A', 'B']) }), // por mapa
]);

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const body = BodySchema.parse(await req.json());

    const result =
      'gameIndex' in body
        ? await reportGameAndMaybeClose(id, body.gameIndex, body.winnerSide)
        : await fastReportWinnerAndPropagate(id, body.winnerSide);

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { code: 'BAD_REQUEST', error: 'Payload inválido', issues: e.issues },
        { status: 400 }
      );
    }
    if (e instanceof AppError) {
      const status = e.code === 'NOT_FOUND' ? 404 : 400;
      return NextResponse.json({ code: e.code, error: e.message }, { status });
    }
    console.error('[POST /api/matches/:id/report]', e);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
