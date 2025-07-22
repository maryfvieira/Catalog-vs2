// tests/global-setup.ts
import { setupInMemoryDatabase } from './setup-db';

module.exports = async () => {
  process.env.NODE_ENV = 'test';
  process.env.USE_IN_MEMORY_DB = 'true';
  await setupInMemoryDatabase();
};
