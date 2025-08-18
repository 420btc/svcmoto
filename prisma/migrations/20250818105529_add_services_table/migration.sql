-- CreateEnum
CREATE TYPE "public"."ServiceStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."services" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "vehicleType" TEXT,
    "description" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "status" "public"."ServiceStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedPrice" DOUBLE PRECISION,
    "finalPrice" DOUBLE PRECISION,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "notes" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."services" ADD CONSTRAINT "services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
