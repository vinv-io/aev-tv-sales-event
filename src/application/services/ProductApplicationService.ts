import { Product } from '@/domain/entities/Product';
import { ProductRepository } from '@/domain/repositories/ProductRepository';
import { ProductRepositoryImpl } from '@/infrastructure/repositories/ProductRepositoryImpl';
import { CreateProductUseCase } from '@/application/use-cases/CreateProductUseCase';
import { GetProductUseCase } from '@/application/use-cases/GetProductUseCase';
import { UpdateProductUseCase } from '@/application/use-cases/UpdateProductUseCase';
import { DeleteProductUseCase } from '@/application/use-cases/DeleteProductUseCase';
import { ListProductsUseCase } from '@/application/use-cases/ListProductsUseCase';

export class ProductApplicationService {
  private productRepository: ProductRepository;
  private createProductUseCase: CreateProductUseCase;
  private getProductUseCase: GetProductUseCase;
  private updateProductUseCase: UpdateProductUseCase;
  private deleteProductUseCase: DeleteProductUseCase;
  private listProductsUseCase: ListProductsUseCase;

  constructor() {
    this.productRepository = new ProductRepositoryImpl();
    this.createProductUseCase = new CreateProductUseCase(this.productRepository);
    this.getProductUseCase = new GetProductUseCase(this.productRepository);
    this.updateProductUseCase = new UpdateProductUseCase(this.productRepository);
    this.deleteProductUseCase = new DeleteProductUseCase(this.productRepository);
    this.listProductsUseCase = new ListProductsUseCase(this.productRepository);
  }

  async createProduct(productData: {
    id: string;
    name: { en: string; vi: string };
    description: { en: string; vi: string };
    image: string;
    aiHint?: string;
  }): Promise<Product> {
    return await this.createProductUseCase.execute(productData);
  }

  async getProduct(id: string): Promise<Product | null> {
    return await this.getProductUseCase.execute(id);
  }

  async updateProduct(id: string, updateData: Partial<{
    name: { en: string; vi: string };
    description: { en: string; vi: string };
    image: string;
    aiHint: string;
  }>): Promise<Product> {
    return await this.updateProductUseCase.execute(id, updateData);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }

  async getProducts(): Promise<Product[]> {
    return await this.listProductsUseCase.execute();
  }

  async getProductsAsPlainObjects(): Promise<any[]> {
    const products = await this.getProducts();
    return products.map(product => product.toPlainObject());
  }
}
