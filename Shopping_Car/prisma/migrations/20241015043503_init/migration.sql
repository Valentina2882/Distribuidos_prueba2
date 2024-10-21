/*
  Warnings:

  - You are about to drop the `Shopping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Shopping";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ShoppingCartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cartId" INTEGER NOT NULL,
    CONSTRAINT "ShoppingCartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "ShoppingCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
