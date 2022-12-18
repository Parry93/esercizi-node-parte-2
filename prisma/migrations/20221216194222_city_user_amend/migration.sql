/*
  Warnings:

  - You are about to drop the column `uodatedBy` on the `city` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "city" DROP COLUMN "uodatedBy",
ADD COLUMN     "updatedBy" VARCHAR(255);
