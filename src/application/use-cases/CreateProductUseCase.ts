import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { LocalizedText } from '../../domain/value-objects/LocalizedText';

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(productData: {
    id: string;
    name: { en: string; vi: string };
    description: { en: string; vi: string };
    image: string;
  }): Promise<Product> {
    const name = new LocalizedText(productData.name.en, productData.name.vi);
    const description = new LocalizedText(productData.description.en, productData.description.vi);
    
    const product = new Product(
      productData.id,
      name,
      description,
      productData.image
    );

    return await this.productRepository.create(product);
  }
}
