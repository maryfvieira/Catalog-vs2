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

const prisma = getPrismaClient(); // <- usa função dinâmica
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
container.bind<IProductService>(TYPES.ProductService).to(ProductService);
container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);

export { container };
