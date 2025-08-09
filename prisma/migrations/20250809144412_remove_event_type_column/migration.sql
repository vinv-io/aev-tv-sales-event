/*
  Warnings:

  - You are about to drop the column `type` on the `events` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "ai_hint" TEXT
);
INSERT INTO "new_events" ("ai_hint", "description", "end_date", "id", "image", "name", "start_date", "status") SELECT "ai_hint", "description", "end_date", "id", "image", "name", "start_date", "status" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
