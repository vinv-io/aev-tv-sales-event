import { Package } from '../entities/Package';

export interface IPackageRepository {
  findAll(): Promise<Package[]>;
  findById(id: string): Promise<Package | null>;
  findActive(): Promise<Package[]>;
  save(packageEntity: Package): Promise<Package>;
  update(id: string, packageData: Partial<Package>): Promise<Package>;
  delete(id: string): Promise<void>;
}
