// tests/setup-db.ts
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const setupInMemoryDatabase = async () => {
  const shouldUseInMemory = process.env.NODE_ENV === 'test' || process.env.USE_IN_MEMORY_DB === 'true';

  if (!shouldUseInMemory) {
    console.log('🔗 Usando banco de dados real.');
    return;
  }

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.DATABASE_URL = mongoUri;

  console.log('🧪 DATABASE_URL ajustada para in-memory:', mongoUri);
};

export const teardownInMemoryDatabase = async () => {
  if (mongoServer) {
    await mongoServer.stop();
    console.log('🧪 Banco de dados em memória finalizado');
  }
};

export const getTestDatabaseUri = async () => {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }
  return mongoServer.getUri();
};
