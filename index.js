const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear un usuario
  const newUser = await prisma.user.create({
    data: {
      name: "Juan Pérez",
      email: "juan@example.com",
    },
  });

  console.log("Nuevo usuario creado:", newUser);

  // Ver usuarios en la base de datos
  const users = await prisma.user.findMany();
  console.log("Usuarios en la base de datos:", users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });



