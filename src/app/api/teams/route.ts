import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        captain: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            player: {
              select: {
                id: true,
                name: true,
                rolePreference: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Error al obtener los equipos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, captainId, logoUrl } = body;

    if (!name || !captainId) {
      return NextResponse.json({ error: 'name y captainId son requeridos' }, { status: 400 });
    }

    const captain = await prisma.player.findUnique({
      where: { id: captainId },
    });

    if (!captain) {
      return NextResponse.json(
        { error: 'El jugador especificado como capitán no existe' },
        { status: 404 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        captainId,
        logoUrl: logoUrl || null,
      },
      include: {
        captain: true,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error: any) {
    console.error('Error creating team:', error);

    if (error === 'P2002') {
      return NextResponse.json({ error: 'Ya existe un equipo con ese nombre' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Error al crear el equipo' }, { status: 500 });
  }
}
