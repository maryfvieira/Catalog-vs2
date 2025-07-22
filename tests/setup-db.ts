// tests/setup-db.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PrismaClient } from '@prisma/client';

let mongoServer: MongoMemoryServer | null = null;
const prisma = new PrismaClient();

export const setupInMemoryDatabase = async () => {
  const shouldUseInMemory = process.env.NODE_ENV === 'test' || process.env.USE_IN_MEMORY_DB === 'true';

  if (!shouldUseInMemory) {
    console.log('🔗 Usando banco de dados real.');
    return;
  }

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.DATABASE_URL = mongoUri;

  console.log('🧪 Inicializando banco de dados em memória:', mongoUri);

  await prisma.$disconnect(); // desconecta de qualquer instância anterior
  await prisma.$connect();
};

export const teardownInMemoryDatabase = async () => {
  await prisma.$disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    console.log('🧪 Banco de dados em memória finalizado');
  }
};

export const resetDatabase = async () => {
  await prisma.product.deleteMany();
};
