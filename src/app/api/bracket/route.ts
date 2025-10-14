// src/app/api/bracket/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from '@/types/api.types';
import {
  generateFromRegistrations,
  getLatestBracket,
} from '@/repositories/breackert/bracket.repository';

export async function GET() {
  try {
    const data = await getLatestBracket();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    if (e instanceof AppError) {
      const status = e.code === 'NOT_FOUND' ? 404 : 400;
      return NextResponse.json({ code: e.code, error: e.message }, { status });
    }
    console.error('[GET /api/bracket]', e);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}

const BodySchema = z.object({
  mode: z.literal('auto').default('auto'), // dejamos solo auto por ahora
  seedStrategy: z.enum(['registrationOrder', 'random']).default('registrationOrder'),
  bestOf: z.number().int().min(1).max(7).optional(),
  slug: z.string().optional(), // opcional: si viene, genera para ese torneo
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = BodySchema.parse(body);

    const result = await generateFromRegistrations({
      slug: input.slug,
      seedStrategy: input.seedStrategy,
      bestOf: input.bestOf ?? 1,
    });

    return NextResponse.json(result, { status: 201 });
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
    console.error('[POST /api/bracket]', e);
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 });
  }
}
