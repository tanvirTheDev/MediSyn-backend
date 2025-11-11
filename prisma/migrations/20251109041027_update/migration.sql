-- AlterTable
ALTER TABLE "patient_health_data" ALTER COLUMN "smokingStatus" DROP NOT NULL,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "pregnancyStatus" SET DEFAULT false,
ALTER COLUMN "hasPastSurgeries" SET DEFAULT false,
ALTER COLUMN "recentAnxiety" SET DEFAULT false,
ALTER COLUMN "recentDepression" SET DEFAULT false,
ALTER COLUMN "maritalStatus" SET DEFAULT 'SINGLE';
