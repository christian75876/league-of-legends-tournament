import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SoloRegister } from "@/lib/validators";

export async function POST(req: Request) {
  const { tournamentId, playerId, rolePreference } = SoloRegister.parse(await req.json());
  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament?.allowSolo) return new NextResponse("Solo registrations disabled for this tournament", { status: 400 });

  const reg = await prisma.soloRegistration.create({ data: { tournamentId, playerId, rolePreference } });
  return NextResponse.json(reg);
}
