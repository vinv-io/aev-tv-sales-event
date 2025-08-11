import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { LocalizedText } from '../../domain/value-objects/LocalizedText';
import * as database from '../../lib/data/postgres';

export class ProductRepositoryImpl implements ProductRepository {
  async getById(id: string): Promise<Product | null> {
    const productData = await database.getProducts();
    const found = productData.find(p => p.id === id);
    if (!found) return null;
    
    return this.toDomain(found);
  }

  async getAll(): Promise<Product[]> {
    const productsData = await database.getProducts();
    return productsData.map(data => this.toDomain(data));
  }

  async create(product: Product): Promise<Product> {
    const productData = {
      id: product.id,
      name: product.name.toPlainObject(),
      description: product.description.toPlainObject(),
      image: product.image
    };
    
    const createdData = await database.createProduct(productData);
    return this.toDomain(createdData);
  }

  async update(id: string, product: Product): Promise<Product> {
    const updateData = {
      id: product.id,
      name: product.name.toPlainObject(),
      description: product.description.toPlainObject(),
      image: product.image
    };
    
    const updatedData = await database.updateProduct(id, updateData);
    if (!updatedData) {
      throw new Error(`Product with id ${id} not found`);
    }
    
    return this.toDomain(updatedData);
  }

  async delete(id: string): Promise<void> {
    await database.deleteProduct(id);
  }

  private toDomain(data: any): Product {
    const name = LocalizedText.fromPlainObject(data.name);
    const description = LocalizedText.fromPlainObject(data.description);
    
    return new Product(
      data.id,
      name,
      description,
      data.image
    );
  }
}
