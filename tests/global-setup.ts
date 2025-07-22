// tests/global-setup.ts
import { setupInMemoryDatabase } from './setup-db';

module.exports = async () => {
  process.env.USE_IN_MEMORY_DB = 'true';
  process.env.NODE_ENV = 'test';

  await setupInMemoryDatabase();
};
