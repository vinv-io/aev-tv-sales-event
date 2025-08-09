import { ProductRepository } from '../../domain/repositories/ProductRepository';

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const existingProduct = await this.productRepository.getById(id);
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    await this.productRepository.delete(id);
  }
}
