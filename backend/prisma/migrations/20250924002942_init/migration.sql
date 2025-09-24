CREATE TYPE "Status" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETE', 'NO_OG', 'FAILED');

CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'QUEUED',
    "ogImageUrl" TEXT,
    "ogTitle" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
