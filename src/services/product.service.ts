import { injectable, inject } from 'inversify';
import { IProductService } from '../interfaces/product-service.interface';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { TYPES } from '../inversify/types';
import { Product } from '../model/product';
import { ProductCreateDto } from '../dto/product-create.dto';
import { ProductUpdateDto } from '../dto/product-update.dto';
import { Mapper } from '../utils/mapper';

@injectable()
export class ProductService implements IProductService {
  constructor(@inject(TYPES.ProductRepository) private repo: IProductRepository) {}

  getAll() {
    return this.repo.findAll();
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  create(dto: ProductCreateDto) {
     const product = Mapper.toEntity(dto, Product);
    return this.repo.create(product);
  }

  update(id: string, dto: Partial<ProductUpdateDto>) {
    const product = Mapper.toEntity(dto, Product);
    return this.repo.update(id, product);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
