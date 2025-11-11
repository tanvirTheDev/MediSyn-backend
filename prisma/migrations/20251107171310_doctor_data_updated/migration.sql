/*
  Warnings:

  - You are about to drop the column `appointmentsFee` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "appointmentsFee",
ADD COLUMN     "appointmentFee" INTEGER;
