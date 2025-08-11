import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { LocalizedText } from '../../domain/value-objects/LocalizedText';

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, updateData: Partial<{
    name: { en: string; vi: string };
    description: { en: string; vi: string };
    image: string;
  }>): Promise<Product> {
    const existingProduct = await this.productRepository.getById(id);
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updates: any = {};
    
    if (updateData.name) {
      updates.name = new LocalizedText(updateData.name.en, updateData.name.vi);
    }
    
    if (updateData.description) {
      updates.description = new LocalizedText(updateData.description.en, updateData.description.vi);
    }
    
    if (updateData.image) {
      updates.image = updateData.image;
    }

    const updatedProduct = existingProduct.update(updates);
    return await this.productRepository.update(id, updatedProduct);
  }
}
