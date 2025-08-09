import { Product } from '../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
