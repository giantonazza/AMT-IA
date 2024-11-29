/*
  Warnings:

  - You are about to drop the column `createdBy` on the `InvitationCode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvitationCode" DROP CONSTRAINT "InvitationCode_createdBy_fkey";

-- AlterTable
ALTER TABLE "InvitationCode" DROP COLUMN "createdBy",
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;
