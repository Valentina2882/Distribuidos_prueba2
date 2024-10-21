/*
  Warnings:

  - You are about to drop the column `orderId` on the `Payments` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'processed'
);
INSERT INTO "new_Payments" ("amount", "date", "id", "method", "status") SELECT "amount", "date", "id", "method", "status" FROM "Payments";
DROP TABLE "Payments";
ALTER TABLE "new_Payments" RENAME TO "Payments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
