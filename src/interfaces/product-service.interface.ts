import { Product } from "../model/product";

export interface IProductService {
    getAll(): Promise<Product[]>;
    getById(id: string): Promise<Product | null>;
    create(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<void>;
  }