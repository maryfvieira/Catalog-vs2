// test/setup.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

module.exports = async () => {
  await prisma.$connect();
  await prisma.product.deleteMany();
  await prisma.$disconnect();
};