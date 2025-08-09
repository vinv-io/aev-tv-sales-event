import { Product } from '../entities/Product';

export interface ProductRepository {
  getById(id: string): Promise<Product | null>;
  getAll(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
