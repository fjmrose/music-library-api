/*
  Warnings:

  - You are about to drop the column `artist_id` on the `Track` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TrackType" AS ENUM ('ORIGINAL', 'REMIX', 'EDIT', 'CLUB_MIX', 'RADIO_EDIT', 'BOOTLEG');

-- DropForeignKey
ALTER TABLE "Track" DROP CONSTRAINT "Track_artist_id_fkey";

-- AlterTable
ALTER TABLE "Track" DROP COLUMN "artist_id",
ADD COLUMN     "track_type" "TrackType" NOT NULL DEFAULT 'ORIGINAL';

-- CreateTable
CREATE TABLE "_artist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_remix_artist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_artist_AB_unique" ON "_artist"("A", "B");

-- CreateIndex
CREATE INDEX "_artist_B_index" ON "_artist"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_remix_artist_AB_unique" ON "_remix_artist"("A", "B");

-- CreateIndex
CREATE INDEX "_remix_artist_B_index" ON "_remix_artist"("B");

-- AddForeignKey
ALTER TABLE "_artist" ADD CONSTRAINT "_artist_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_artist" ADD CONSTRAINT "_artist_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_remix_artist" ADD CONSTRAINT "_remix_artist_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_remix_artist" ADD CONSTRAINT "_remix_artist_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
