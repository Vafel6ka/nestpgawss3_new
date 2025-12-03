/*
  Warnings:

  - You are about to drop the column `userId` on the `GroupPost` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "GroupPost_userId_key";

-- AlterTable
ALTER TABLE "GroupPost" DROP COLUMN "userId";
