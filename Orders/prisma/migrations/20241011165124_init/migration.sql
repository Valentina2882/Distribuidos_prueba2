/*
  Warnings:

  - You are about to drop the column `orderDate` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `Orders` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentId" INTEGER
);
INSERT INTO "new_Orders" ("id", "product", "status", "total") SELECT "id", "product", "status", "total" FROM "Orders";
DROP TABLE "Orders";
ALTER TABLE "new_Orders" RENAME TO "Orders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
