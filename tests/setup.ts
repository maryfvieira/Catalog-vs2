// tests/setup.ts
import { setupInMemoryDatabase, teardownInMemoryDatabase } from './setup-db';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.USE_IN_MEMORY_DB = 'true';

  await setupInMemoryDatabase();

  // somente depois de definir DATABASE_URL, carregue o prisma e container
  const { getPrismaClient } = await import('../src/prisma/prisma.client');
  const prisma = getPrismaClient();
  await prisma.$connect();
});

afterAll(async () => {
  const { getPrismaClient } = await import('../src/prisma/prisma.client');
  const prisma = getPrismaClient();
  await prisma.$disconnect();
  await teardownInMemoryDatabase();
});

beforeEach(async () => {
  const { getPrismaClient } = await import('../src/prisma/prisma.client');
  const prisma = getPrismaClient();
  await prisma.product.deleteMany();
});
