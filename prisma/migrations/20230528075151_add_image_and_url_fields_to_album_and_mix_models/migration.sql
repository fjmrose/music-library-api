/*
  Warnings:

  - Added the required column `url` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Mix` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "image" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mix" ADD COLUMN     "image" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;
