-- CreateTable
CREATE TABLE "Cities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "european" BOOLEAN NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "inhabitans" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);
