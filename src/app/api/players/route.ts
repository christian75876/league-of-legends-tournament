import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreatePlayer } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json();
  const data = CreatePlayer.parse(body);
  const player = await prisma.player.create({ data });
  return NextResponse.json(player);
}
