-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Torrent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "magnetLink" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reviewed" TEXT NOT NULL DEFAULT 'pending'
);
INSERT INTO "new_Torrent" ("createdAt", "description", "id", "magnetLink", "name", "source") SELECT "createdAt", "description", "id", "magnetLink", "name", "source" FROM "Torrent";
DROP TABLE "Torrent";
ALTER TABLE "new_Torrent" RENAME TO "Torrent";
CREATE UNIQUE INDEX "Torrent_magnetLink_key" ON "Torrent"("magnetLink");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
