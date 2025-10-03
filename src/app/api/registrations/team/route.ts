import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { TeamRegister } from "@/lib/validators";

export async function POST(req: Request) {
  const { tournamentId, teamId } = TeamRegister.parse(await req.json());

  const count = await prisma.teamMember.count({ where: { teamId } });
  if (count < 5 || count > 6) return new NextResponse("Team must have 5-6 players", { status: 400 });

  const reg = await prisma.teamRegistration.create({ data: { tournamentId, teamId } });
  return NextResponse.json(reg);
}
