/*
  Warnings:

  - Added the required column `orderId` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'processed',
    "orderId" INTEGER NOT NULL
);
INSERT INTO "new_Payments" ("amount", "date", "id", "method", "status") SELECT "amount", "date", "id", "method", "status" FROM "Payments";
DROP TABLE "Payments";
ALTER TABLE "new_Payments" RENAME TO "Payments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
