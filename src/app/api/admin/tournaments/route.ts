import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  await requireAdmin();
  const data = await req.json();
  const tournament = await prisma.tournament.create({ data });
  return NextResponse.json(tournament);
}
