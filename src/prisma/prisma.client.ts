// src/prisma/prisma.client.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;
let lastDatabaseUrl: string | null = null;

export const getPrismaClient = () => {
  const currentDatabaseUrl = process.env.DATABASE_URL;

  if (!prisma || lastDatabaseUrl !== currentDatabaseUrl) {
    if (prisma) {
      console.log('🔄 DATABASE_URL mudou, criando nova instância do PrismaClient');
      prisma.$disconnect();
    }
    lastDatabaseUrl = currentDatabaseUrl || '';
    console.log('♻️ Criando PrismaClient com:', lastDatabaseUrl);
    prisma = new PrismaClient();
  }

  return prisma;
};
