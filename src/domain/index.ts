// Domain Layer Exports
export * from './entities/Event';
export * from './entities/Product';
export * from './entities/Customer';
export * from './entities/Order';
export * from './entities/CheckIn';
export * from './entities/Package';
export * from './entities/LeaderboardEntry';

export * from './value-objects/LocalizedText';
export * from './value-objects/DateRange';

export * from './repositories/IEventRepository';
export * from './repositories/IProductRepository';
export * from './repositories/ICustomerRepository';
export * from './repositories/IOrderRepository';
export * from './repositories/ICheckInRepository';
export * from './repositories/IPackageRepository';
export * from './repositories/ILeaderboardRepository';

// Domain Types (with explicit naming to avoid conflicts)
export type {
  DomainId,
  Timestamps,
  LocalizedContent,
  EventData,
  ProductData,
  CustomerData,
  OrderData,
  OrderProduct,
  OrderStatus,
  CheckInData,
  PackageData,
  LeaderboardData,
  BusinessRule,
  DomainEvent,
  Money,
  PhoneNumber,
  DomainErrorType,
  DomainErrorInfo
} from './types';
