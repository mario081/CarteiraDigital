-- CreateTable
CREATE TABLE "public"."Conta" (
    "id" TEXT NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Conta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conta_userId_key" ON "public"."Conta"("userId");

-- AddForeignKey
ALTER TABLE "public"."Conta" ADD CONSTRAINT "Conta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
