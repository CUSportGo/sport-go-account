-- CreateTable
CREATE TABLE "Blacklist" (
    "outDatedRefreshToken" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_outDatedRefreshToken_key" ON "Blacklist"("outDatedRefreshToken");
