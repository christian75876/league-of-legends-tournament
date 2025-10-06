import { NextResponse } from 'next/server';
import { inscriptionFormSchema } from '@/features/inscription/schemas/inscription.schema';
import { createTeamFromInscription } from '@/repositories/inscription.repository';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = inscriptionFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Datos de inscripción inválidos',
          details: parsed.error,
        },
        { status: 400 }
      );
    }

    const team = await createTeamFromInscription(parsed.data);

    return NextResponse.json(
      {
        success: true,
        team: {
          id: team.id,
          name: team.name,
          captain: team.captain,
          members: team.members,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en inscripción:', error);

    return NextResponse.json(
      {
        error: error.message || 'No se pudo procesar la inscripción',
      },
      { status: 500 }
    );
  }
}
