/*
  Warnings:

  - Added the required column `buyPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `buyPrice` DECIMAL(15, 2) NOT NULL;
