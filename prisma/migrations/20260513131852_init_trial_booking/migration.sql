-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT NOT NULL,
    "childAge" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialBooking" (
    "id" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "parentEmail" TEXT,
    "childAge" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "preferredTime" TEXT,
    "message" TEXT,
    "contacted" BOOLEAN NOT NULL DEFAULT false,
    "contactedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrialBooking_pkey" PRIMARY KEY ("id")
);
