/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `GroupPost` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `GroupPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupPost" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GroupPost_userId_key" ON "GroupPost"("userId");

-- AddForeignKey
ALTER TABLE "UserSetting" ADD CONSTRAINT "UserSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
