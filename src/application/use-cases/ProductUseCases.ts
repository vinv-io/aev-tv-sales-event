import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { NotFoundError } from '../../shared/errors/DomainErrors';
import { LocalizedText } from '../../domain/value-objects/LocalizedText';

export interface CreateProductRequest {
  name: { en: string; vi: string };
  description: { en: string; vi: string };
  image?: string;
}

export interface UpdateProductRequest {
  name?: { en: string; vi: string };
  description?: { en: string; vi: string };
  image?: string;
}

export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}

export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    return product;
  }
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    const product = new Product(
      `PROD${Date.now()}`,
      new LocalizedText(request.name.en, request.name.vi),
      new LocalizedText(request.description.en, request.description.vi),
      request.image || 'https://placehold.co/600x400.png'
    );

    return await this.productRepository.save(product);
  }
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, request: UpdateProductRequest): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Product', id);
    }

    const updates: any = {};
    
    if (request.name) {
      updates.name = new LocalizedText(request.name.en, request.name.vi);
    }
    
    if (request.description) {
      updates.description = new LocalizedText(request.description.en, request.description.vi);
    }
    
    if (request.image) {
      updates.image = request.image;
    }

    const updatedProduct = existingProduct.update(updates);
    return await this.productRepository.save(updatedProduct);
  }
}

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.productRepository.exists(id);
    if (!exists) {
      throw new NotFoundError('Product', id);
    }

    await this.productRepository.delete(id);
  }
}
