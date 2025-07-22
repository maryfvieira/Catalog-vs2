// src/prisma/prisma.client.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export const getPrismaClient = () => {
  if (!prisma) {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL não está definida');
    }

    prisma = new PrismaClient({
      datasources: { db: { url: dbUrl } },
    });
  }

  return prisma;
};
