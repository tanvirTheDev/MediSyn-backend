-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
