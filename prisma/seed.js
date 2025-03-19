const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.broker.create({
        data: {
            nombre: "Broker Ejemplo",
            email: "broker@ejemplo.com"
        }
    });

    console.log("✅ Seed ejecutado correctamente");
}

main()
    .catch(e => {
        console.error("❌ Error en el seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

