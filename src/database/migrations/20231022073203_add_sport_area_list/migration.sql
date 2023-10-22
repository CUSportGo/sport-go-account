-- CreateTable
CREATE TABLE "SportArea" (
    "SportAreaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SportArea_SportAreaId_key" ON "SportArea"("SportAreaId");

-- AddForeignKey
ALTER TABLE "SportArea" ADD CONSTRAINT "SportArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
