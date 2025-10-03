/*
  Warnings:

  - You are about to drop the column `stageId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `game` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `riotGameName` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `riotPuuid` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `riotTagLine` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SoloRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TeamMember` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentId,playerId]` on the table `SoloRegistration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamId,playerId]` on the table `TeamMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `SoloRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Match" DROP CONSTRAINT "Match_stageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SoloRegistration" DROP CONSTRAINT "SoloRegistration_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Stage" DROP CONSTRAINT "Stage_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_captainId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- DropIndex
DROP INDEX "public"."Player_userId_key";

-- DropIndex
DROP INDEX "public"."SoloRegistration_tournamentId_userId_key";

-- DropIndex
DROP INDEX "public"."TeamMember_teamId_userId_key";

-- AlterTable
ALTER TABLE "public"."Match" DROP COLUMN "stageId",
ADD COLUMN     "round" INTEGER;

-- AlterTable
ALTER TABLE "public"."Player" DROP COLUMN "game",
DROP COLUMN "rank",
DROP COLUMN "riotGameName",
DROP COLUMN "riotPuuid",
DROP COLUMN "riotTagLine",
DROP COLUMN "userId",
ADD COLUMN     "discord" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."SoloRegistration" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."TeamMember" DROP COLUMN "userId",
ADD COLUMN     "playerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."Profile";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."Stage";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- DropEnum
DROP TYPE "public"."Role";

-- DropEnum
DROP TYPE "public"."StageType";

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "public"."Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SoloRegistration_tournamentId_playerId_key" ON "public"."SoloRegistration"("tournamentId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_playerId_key" ON "public"."TeamMember"("teamId", "playerId");

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "public"."Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamMember" ADD CONSTRAINT "TeamMember_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SoloRegistration" ADD CONSTRAINT "SoloRegistration_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "public"."Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
