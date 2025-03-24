-- CreateTable
CREATE TABLE "Banco" (
    "id" SERIAL NOT NULL,
    "entidad" TEXT NOT NULL,
    "tasaInteres" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Banco_pkey" PRIMARY KEY ("id")
);
