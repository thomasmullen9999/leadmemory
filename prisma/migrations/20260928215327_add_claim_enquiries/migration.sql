-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('NEW_ENQUIRY', 'CONTACTED', 'UNDER_REVIEW', 'EVIDENCE_REQUESTED', 'SUBMITTED', 'RESOLVED', 'NOT_PROCEEDING');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "claimReference" TEXT,
ADD COLUMN     "claimSummary" TEXT,
ADD COLUMN     "claimType" TEXT,
ADD COLUMN     "consentToContact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSupportingEvidence" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "issueStartDate" TEXT,
ADD COLUMN     "postcode" TEXT,
ADD COLUMN     "preferredContact" TEXT,
ADD COLUMN     "previousComplaint" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacyAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "providerName" TEXT,
ADD COLUMN     "status" "ClaimStatus" NOT NULL DEFAULT 'NEW_ENQUIRY';
