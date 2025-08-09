import type { Product } from '@/types';
import { prisma } from '@/lib/database';

export class ProductService {
  /**
   * Get all products
   */
  static async getAll(): Promise<Product[]> {
    const allProducts = await prisma.product.findMany();
    return allProducts.map(p => ({
      ...p,
      name: JSON.parse(p.name as string),
      description: JSON.parse(p.description as string)
    }));
  }

  /**
   * Get product by ID
   */
  static async getById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) return null;
    
    return {
      ...product,
      name: JSON.parse(product.name as string),
      description: JSON.parse(product.description as string)
    };
  }

  /**
   * Create a new product
   */
  static async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct = {
      id: `PRD${Date.now()}`,
      name: JSON.stringify(productData.name),
      description: JSON.stringify(productData.description),
      image: productData.image,
      aiHint: productData.aiHint,
    };
    
    const result = await prisma.product.create({
      data: newProduct
    });
    
    return {
      ...result,
      name: JSON.parse(result.name as string),
      description: JSON.parse(result.description as string)
    };
  }

  /**
   * Update an existing product
   */
  static async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    const updateData: any = { ...productData };
    if (updateData.name) {
      updateData.name = JSON.stringify(updateData.name);
    }
    if (updateData.description) {
      updateData.description = JSON.stringify(updateData.description);
    }
    
    const result = await prisma.product.update({
      where: { id },
      data: updateData
    });
    
    return {
      ...result,
      name: JSON.parse(result.name as string),
      description: JSON.parse(result.description as string)
    };
  }

  /**
   * Delete a product
   */
  static async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id }
    });
  }
}
