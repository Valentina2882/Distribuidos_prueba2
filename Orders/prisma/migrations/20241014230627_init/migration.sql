/*
  Warnings:

  - You are about to alter the column `productIds` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "productIds" INTEGER,
    "paymentId" INTEGER
);
INSERT INTO "new_Orders" ("id", "paymentId", "productIds", "status", "total") SELECT "id", "paymentId", "productIds", "status", "total" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
