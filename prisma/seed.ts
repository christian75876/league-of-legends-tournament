// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@torneo.gg";
  const hashed = await bcrypt.hash("Admin123!$", 10);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, hashedPassword: hashed, name: "Admin" }
  });

  await prisma.tournament.upsert({
    where: { slug: "lol-open" },
    update: {},
    create: { name: "LoL Open", slug: "lol-open", allowSolo: true, maxTeams: 32 }
  });

  console.log("Seed listo");
}

main().finally(() => prisma.$disconnect());
