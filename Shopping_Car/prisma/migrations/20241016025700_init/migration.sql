/*
  Warnings:

  - Added the required column `productName` to the `ShoppingCartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPrice` to the `ShoppingCartItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShoppingCartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productPrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cartId" INTEGER NOT NULL,
    CONSTRAINT "ShoppingCartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "ShoppingCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ShoppingCartItem" ("cartId", "id", "productId", "quantity") SELECT "cartId", "id", "productId", "quantity" FROM "ShoppingCartItem";
DROP TABLE "ShoppingCartItem";
ALTER TABLE "new_ShoppingCartItem" RENAME TO "ShoppingCartItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
