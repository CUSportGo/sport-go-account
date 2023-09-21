/*
  Warnings:

  - You are about to drop the column `outDatedRefreshToken` on the `Blacklist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[outDatedAccessToken]` on the table `Blacklist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outDatedAccessToken` to the `Blacklist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Blacklist_outDatedRefreshToken_key";

-- AlterTable
ALTER TABLE "Blacklist" DROP COLUMN "outDatedRefreshToken",
ADD COLUMN     "outDatedAccessToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_outDatedAccessToken_key" ON "Blacklist"("outDatedAccessToken");
