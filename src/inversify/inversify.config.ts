import { Container } from 'inversify';
import { TYPES } from './types';

import { IProductService } from '../interfaces/product-service.interface';
import { IProductRepository } from '../interfaces/product-repository.interface';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repository/product.repository';

const container = new Container();

container.bind<IProductService>(TYPES.ProductService).to(ProductService);
container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);

export { container };
