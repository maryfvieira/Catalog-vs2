// tests/setup.ts
import { setupInMemoryDatabase, teardownInMemoryDatabase } from './setup-db';
import { getPrismaClient } from '../src/prisma/prisma.client';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await setupInMemoryDatabase();
  const prisma = getPrismaClient();
  await prisma.$connect();
});

afterAll(async () => {
  const prisma = getPrismaClient();
  await prisma.$disconnect();
  await teardownInMemoryDatabase();
});

beforeEach(async () => {
  const prisma = getPrismaClient();
  await prisma.product.deleteMany();
});
