import { Package } from '../../domain/entities/Package';
import { IPackageRepository } from '../../domain/repositories/IPackageRepository';
import { NotFoundError, BusinessRuleError } from '../../shared/errors/DomainErrors';

export interface CreatePackageRequest {
  name: string;
  description: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
  discount?: number;
  validFrom?: string;
  validUntil?: string;
}

export interface UpdatePackageRequest {
  name?: string;
  description?: string;
  products?: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
  discount?: number;
  isActive?: boolean;
  validFrom?: string;
  validUntil?: string;
}

export class GetAllPackagesUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(): Promise<Package[]> {
    return await this.packageRepository.findAll();
  }
}

export class GetActivePackagesUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(): Promise<Package[]> {
    return await this.packageRepository.findActive();
  }
}

export class GetPackageByIdUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(id: string): Promise<Package> {
    const packageEntity = await this.packageRepository.findById(id);
    if (!packageEntity) {
      throw new NotFoundError('Package', id);
    }
    return packageEntity;
  }
}

export class CreatePackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(request: CreatePackageRequest): Promise<Package> {
    // Validate business rules
    if (request.products.length === 0) {
      throw new BusinessRuleError('Package must contain at least one product');
    }

    const invalidProducts = request.products.filter(p => p.quantity <= 0);
    if (invalidProducts.length > 0) {
      throw new BusinessRuleError('All products must have positive quantity');
    }

    // Validate date range
    if (request.validFrom && request.validUntil && request.validFrom > request.validUntil) {
      throw new BusinessRuleError('Valid from date cannot be later than valid until date');
    }

    // Create domain entity
    const id = `PKG${Date.now()}`;
    const packageEntity = new Package(
      id,
      request.name,
      request.description,
      request.products,
      request.discount || 0,
      true,
      request.validFrom,
      request.validUntil
    );

    // Save to repository
    return await this.packageRepository.save(packageEntity);
  }
}

export class UpdatePackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(id: string, request: UpdatePackageRequest): Promise<Package> {
    const existingPackage = await this.packageRepository.findById(id);
    if (!existingPackage) {
      throw new NotFoundError('Package', id);
    }

    // Validate business rules
    const discount = request.discount ?? existingPackage.discount;

    if (request.products && request.products.length === 0) {
      throw new BusinessRuleError('Package must contain at least one product');
    }

    if (request.products) {
      const invalidProducts = request.products.filter(p => p.quantity <= 0);
      if (invalidProducts.length > 0) {
        throw new BusinessRuleError('All products must have positive quantity');
      }
    }

    // Validate date range
    const validFrom = request.validFrom ?? existingPackage.validFrom;
    const validUntil = request.validUntil ?? existingPackage.validUntil;
    if (validFrom && validUntil && validFrom > validUntil) {
      throw new BusinessRuleError('Valid from date cannot be later than valid until date');
    }

    const updatedPackage = new Package(
      existingPackage.id,
      request.name ?? existingPackage.name,
      request.description ?? existingPackage.description,
      request.products ?? existingPackage.products,
      discount,
      request.isActive ?? existingPackage.isActive,
      validFrom,
      validUntil
    );

    return await this.packageRepository.update(id, updatedPackage);
  }
}

export class DeletePackageUseCase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(id: string): Promise<void> {
    const packageEntity = await this.packageRepository.findById(id);
    if (!packageEntity) {
      throw new NotFoundError('Package', id);
    }

    await this.packageRepository.delete(id);
  }
}
