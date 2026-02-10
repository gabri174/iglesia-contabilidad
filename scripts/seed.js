const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('S@porte777', 10);
  
  const user = await prisma.user.upsert({
    where: { username: 'En Su Presencia' },
    update: {},
    create: {
      username: 'En Su Presencia',
      password: hashedPassword,
    },
  });
  
  console.log('Usuario creado:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
