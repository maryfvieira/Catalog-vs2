import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { Product } from '../model/product';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { DatabaseError } from '../errors/database-error';

@injectable()
export class ProductRepository implements IProductRepository {
  private prisma = new PrismaClient();

  private async safeExecute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        throw new DatabaseError('Falha ao inicializar conexão com banco de dados');
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw new DatabaseError('Erro conhecido do Prisma: ' + error.message);
      }
      if (error instanceof Error && error.message.includes('Authentication failed')) {
        throw new DatabaseError('Falha de autenticação ao conectar com o banco de dados');
      }

      throw error;
    }
  }

  findAll(): Promise<Product[]> {
    return this.safeExecute(() => this.prisma.product.findMany());
  }

  findById(id: string): Promise<Product | null> {
    return this.safeExecute(() =>
      this.prisma.product.findUnique({ where: { id } }),
    );
  }

  create(product: Product): Promise<Product> {
    return this.safeExecute(() =>
      this.prisma.product.create({ data: product }),
    );
  }

  update(id: string, product: Partial<Product>): Promise<Product | null> {
    return this.safeExecute(() =>
      this.prisma.product.update({ where: { id }, data: product }),
    );
  }

  delete(id: string): Promise<void> {
    return this.safeExecute(() =>
      this.prisma.product.delete({ where: { id } }).then(() => {}),
    );
  }
}
