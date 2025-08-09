import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';

export class GetProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return await this.productRepository.getById(id);
  }
}
