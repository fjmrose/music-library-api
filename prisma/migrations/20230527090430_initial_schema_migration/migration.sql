-- CreateEnum
CREATE TYPE "Host" AS ENUM ('YOUTUBE', 'BANDCAMP', 'SOUNDCLOUD', 'OTHER');

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(60) NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "album_id" INTEGER,
    "release_date" TIMESTAMP(3),
    "image" TEXT,
    "url" TEXT NOT NULL,
    "host" "Host" NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mix" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "host" "Host" NOT NULL,

    CONSTRAINT "Mix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GenreToTrack" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToTrack_AB_unique" ON "_GenreToTrack"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToTrack_B_index" ON "_GenreToTrack"("B");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mix" ADD CONSTRAINT "Mix_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToTrack" ADD CONSTRAINT "_GenreToTrack_B_fkey" FOREIGN KEY ("B") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
