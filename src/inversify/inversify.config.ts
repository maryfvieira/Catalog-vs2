// src/inversify/inversify.config.ts
import { Container } from 'inversify';
import { TYPES } from './types';
import { IProductService } from '../interfaces/product-service.interface';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repository/product.repository';
import { PrismaClient } from '@prisma/client';

const container = new Container();

const dbUrl = process.env.DATABASE_URL;

const prisma = dbUrl
  ? new PrismaClient({ datasources: { db: { url: dbUrl } } })
  : new PrismaClient();

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
container.bind<IProductService>(TYPES.ProductService).to(ProductService);
container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);

export { container };
