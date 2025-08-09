import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.getAll();
  }
}
