import { 
  GetAllPackagesUseCase,
  GetActivePackagesUseCase,
  GetPackageByIdUseCase,
  CreatePackageUseCase,
  UpdatePackageUseCase,
  DeletePackageUseCase,
  CreatePackageRequest,
  UpdatePackageRequest
} from '../use-cases/PackageUseCases';
import { PackageRepositoryImpl } from '../../infrastructure/repositories/PackageRepositoryImpl';
import { Package } from '../../domain/entities/Package';

export class PackageApplicationService {
  private packageRepository = new PackageRepositoryImpl();
  
  // Use cases
  private getAllPackagesUseCase = new GetAllPackagesUseCase(this.packageRepository);
  private getActivePackagesUseCase = new GetActivePackagesUseCase(this.packageRepository);
  private getPackageByIdUseCase = new GetPackageByIdUseCase(this.packageRepository);
  private createPackageUseCase = new CreatePackageUseCase(this.packageRepository);
  private updatePackageUseCase = new UpdatePackageUseCase(this.packageRepository);
  private deletePackageUseCase = new DeletePackageUseCase(this.packageRepository);

  async getAllPackages(): Promise<Package[]> {
    return await this.getAllPackagesUseCase.execute();
  }

  async getActivePackages(): Promise<Package[]> {
    return await this.getActivePackagesUseCase.execute();
  }

  async getPackageById(id: string): Promise<Package> {
    return await this.getPackageByIdUseCase.execute(id);
  }

  async createPackage(request: CreatePackageRequest): Promise<Package> {
    return await this.createPackageUseCase.execute(request);
  }

  async updatePackage(id: string, request: UpdatePackageRequest): Promise<Package> {
    return await this.updatePackageUseCase.execute(id, request);
  }

  async deletePackage(id: string): Promise<void> {
    return await this.deletePackageUseCase.execute(id);
  }
}
