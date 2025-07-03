import { injectable, inject } from 'inversify';
import { IProductService } from '../interfaces/product-service.interface';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { TYPES } from '../inversify/types';
import { Product } from '../model/product';

@injectable()
export class ProductService implements IProductService {
  constructor(@inject(TYPES.ProductRepository) private repo: IProductRepository) {}

  getAll() {
    return this.repo.findAll();
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  create(product: Product) {
    return this.repo.create(product);
  }

  update(id: string, product: Partial<Product>) {
    return this.repo.update(id, product);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
