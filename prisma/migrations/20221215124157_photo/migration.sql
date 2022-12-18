/*
  Warnings:

  - You are about to drop the `Cities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Cities";

-- CreateTable
CREATE TABLE "city" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "european" BOOLEAN NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "inhabitans" INTEGER NOT NULL,
    "photoFilename" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);
