/*
  Warnings:

  - You are about to drop the column `name` on the `Broker` table. All the data in the column will be lost.
  - Added the required column `nombre` to the `Broker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Broker" DROP COLUMN "name",
ADD COLUMN     "nombre" TEXT NOT NULL;
