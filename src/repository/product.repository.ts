import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { Product } from '../model/product';

@injectable()
export class ProductRepository implements IProductRepository {
  private prisma = new PrismaClient();
  

  findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  create(product: Product): Promise<Product> {
    return this.prisma.product.create({ data: product });
  }

  update(id: string, product: Partial<Product>): Promise<Product | null> {
    return this.prisma.product.update({ where: { id }, data: product });
  }

  delete(id: string): Promise<void> {
    return this.prisma.product.delete({ where: { id } }).then(() => {});
  }
}