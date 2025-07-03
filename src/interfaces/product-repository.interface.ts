import { Product } from "../model/product";

export interface IProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    create(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<void>;
  }