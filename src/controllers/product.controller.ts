import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IProductService } from '../interfaces/product-service.interface';
import { TYPES } from '../inversify/types';
import { Product } from '../model/product';

@controller('/products')
export class ProductController {
  constructor(@inject(TYPES.ProductService) private service: IProductService) {}

  @httpGet('/')
  getAll() {
    return this.service.getAll();
  }

  @httpGet('/:id')
  getById(@requestParam('id') id: string) {
    return this.service.getById(id);
  }

  @httpPost('/')
  create(@requestBody() product: Product) {
    return this.service.create(product);
  }

  @httpPut('/:id')
  update(@requestParam('id') id: string, @requestBody() product: Partial<Product>) {
    return this.service.update(id, product);
  }

  @httpDelete('/:id')
  delete(@requestParam('id') id: string) {
    return this.service.delete(id);
  }
}