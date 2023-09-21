-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleID" TEXT,
ADD COLUMN     "photoURL" TEXT,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
