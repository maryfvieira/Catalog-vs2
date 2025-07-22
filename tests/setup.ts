// tests/setup.ts
import { setupInMemoryDatabase, resetDatabase } from './setup-db';

beforeAll(async () => {
  process.env.NODE_ENV = 'test'; // força o uso do banco em memória
  await setupInMemoryDatabase();
});

beforeEach(async () => {
  await resetDatabase(); // limpa a base entre os testes
});

afterAll(async () => {
  // finaliza o banco após todos os testes
  const { teardownInMemoryDatabase } = await import('./setup-db');
  await teardownInMemoryDatabase();
});
