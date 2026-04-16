/*
  Warnings:

  - Added the required column `display_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "display_name" TEXT NOT NULL;
