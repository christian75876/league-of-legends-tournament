import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateTeam } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, captainId, memberIds } = CreateTeam.parse(body);

  const uniqueMemberIds = Array.from(new Set(memberIds));
  if (uniqueMemberIds.includes(captainId)) {
    return new NextResponse("Captain cannot be in memberIds", { status: 400 });
  }
  const total = 1 + uniqueMemberIds.length;
  if (total < 5 || total > 6) {
    return new NextResponse("Team must have 5-6 players (captain included)", { status: 400 });
  }

  const team = await prisma.team.create({
    data: {
      name,
      captainId,
      members: {
        create: [
          { playerId: captainId },
          ...uniqueMemberIds.map((pid) => ({ playerId: pid }))
        ]
      }
    },
    include: { members: true }
  });

  return NextResponse.json(team);
}
