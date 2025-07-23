// src/inversify/inversify.config.ts
import { Container } from 'inversify';
import { TYPES } from './types';
import { IProductService } from '../interfaces/product-service.interface';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repository/product.repository';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../prisma/prisma.client';

const container = new Container();

// ✅ Verifica se já existe binding para evitar duplicidade
if (!container.isBound(TYPES.PrismaClient)) {
  container
    .bind<PrismaClient>(TYPES.PrismaClient)
    .toDynamicValue(() => getPrismaClient());
}

if (!container.isBound(TYPES.ProductService)) {
  container.bind<IProductService>(TYPES.ProductService).to(ProductService);
}

if (!container.isBound(TYPES.ProductRepository)) {
  container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);
}

export { container };
