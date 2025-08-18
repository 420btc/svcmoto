-- CreateEnum
CREATE TYPE "public"."DiscountStatus" AS ENUM ('PENDING', 'VALIDATED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."points_ledger" ADD COLUMN     "discountId" TEXT;

-- CreateTable
CREATE TABLE "public"."discounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pointsUsed" INTEGER NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "discountCode" TEXT NOT NULL,
    "status" "public"."DiscountStatus" NOT NULL DEFAULT 'PENDING',
    "validatedAt" TIMESTAMP(3),
    "validatedBy" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discounts_discountCode_key" ON "public"."discounts"("discountCode");

-- AddForeignKey
ALTER TABLE "public"."points_ledger" ADD CONSTRAINT "points_ledger_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "public"."discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."discounts" ADD CONSTRAINT "discounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
