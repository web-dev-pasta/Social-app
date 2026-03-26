/*
  Warnings:

  - You are about to drop the column `display_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_name_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "display_name",
DROP COLUMN "name",
ADD COLUMN     "display_username" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
