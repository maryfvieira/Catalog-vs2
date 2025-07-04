import { controller, httpGet, httpPost, httpPut, httpDelete, requestParam, requestBody } from 'inversify-express-utils';
import { inject } from 'inversify';
import { IProductService } from '../interfaces/product-service.interface';
import { TYPES } from '../inversify/types';
import { Product } from '../model/product';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { ProductCreateDto } from '../dto/product-create.dto';
import { ProductUpdateDto } from '../dto/product-update.dto';

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

  @httpPost('/', validationMiddleware(ProductCreateDto))
  create(@requestBody() dto: ProductCreateDto) {
    return this.service.create(dto);
  }

  @httpPut('/:id', validationMiddleware(ProductUpdateDto))
  update(@requestParam('id') id: string, @requestBody() dto: Partial<ProductUpdateDto>) {
    return this.service.update(id, dto);
  }

  @httpDelete('/:id')
  delete(@requestParam('id') id: string) {
    return this.service.delete(id);
  }
}