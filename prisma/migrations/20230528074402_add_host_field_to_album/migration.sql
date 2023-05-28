/*
  Warnings:

  - Added the required column `host` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "host" "Host" NOT NULL;
