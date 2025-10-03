-- CreateTable
CREATE TABLE "public"."Historico" (
    "id" TEXT NOT NULL,
    "contaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Historico" ADD CONSTRAINT "Historico_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "public"."Conta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
