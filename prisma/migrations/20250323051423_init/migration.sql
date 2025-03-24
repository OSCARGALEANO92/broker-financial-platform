-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Broker" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Broker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "documento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "montosolicitado" DOUBLE PRECISION NOT NULL,
    "banco" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correo" TEXT,
    "barrio" TEXT,
    "ciudad" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "estadoCivil" TEXT,
    "nacionalidad" TEXT,
    "empresa" TEXT,
    "ruc" TEXT,
    "actividadEmpresa" TEXT,
    "ingresos" DOUBLE PRECISION,
    "fechaCobro" TIMESTAMP(3),
    "antiguedad" TEXT,
    "referencia1" TEXT,
    "relacion1" TEXT,
    "celular1" TEXT,
    "referencia2" TEXT,
    "relacion2" TEXT,
    "celular2" TEXT,
    "referencia3" TEXT,
    "relacion3" TEXT,
    "celular3" TEXT,
    "plazo" TEXT,
    "destino" TEXT,
    "coodeudor" BOOLEAN NOT NULL DEFAULT false,
    "documentos" JSONB,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" SERIAL NOT NULL,
    "documento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Broker_email_key" ON "Broker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_documento_key" ON "Cliente"("documento");
