import { ProductCreateDto } from "../dto/product-create.dto";
import { ProductUpdateDto } from "../dto/product-update.dto";
import { Product } from "../model/product";

export interface IProductService {
    getAll(): Promise<Product[]>;
    getById(id: string): Promise<Product | null>;
    create(product: ProductCreateDto): Promise<Product>;
    update(id: string, product: Partial<ProductUpdateDto>): Promise<Product | null>;
    delete(id: string): Promise<void>;
  }