import 'dotenv/config';
import { PrismaClient, Role } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) });

async function main() {
  const email = 'admin@admin.com';

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (!userExists) {
    const hashedPassword = await bcrypt.hash('123456', 10);

    await prisma.user.create({
      data: {
        name: 'Administrador',
        email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log('✅ Usuário admin criado com sucesso!');
  } else {
    console.log('ℹ️ Usuário admin já existe.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });