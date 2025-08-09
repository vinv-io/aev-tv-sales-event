import type { ID, LocalizedString, Timestamp, Status, Currency } from './common';

export type EventType = 'simple_packages' | 'complex_packages';

export type Event = {
  id: ID;
  name: LocalizedString | string;
  type?: EventType;
  startDate: Timestamp;
  endDate: Timestamp;
  status: Status;
};

export type Product = {
  id: ID;
  name: LocalizedString | string;
  description: LocalizedString | string;
  image: string;
  aiHint: string;
};

export type Customer = {
  id: ID;
  phone: string;
  shopName: string;
  joined: Timestamp;
};

export type OrderProduct = {
  id: ID;
  quantity: number;
  name?: string;
};

export type Order = {
  orderId: ID;
  shopName: string;
  products: OrderProduct[];
  total: Currency;
  orderDate: Timestamp;
  eventId: ID;
};

export type CheckIn = {
  customerId: ID;
  shopName: string;
  phone: string;
  eventId: ID;
  checkInTime: Timestamp;
};

export type LeaderboardEntry = {
  shopName: string;
  eventId: ID;
  products: {
    id: ID;
    quantity: number;
  }[];
};

export type PackageType = 'Simple' | 'Complex';

export type PackageGroup = {
  id: ID;
  name: string;
  packageId: ID;
  requiredQuantity: number;
  products: Product[];
};

export type Package = {
  id: ID;
  name: LocalizedString | string;
  description: LocalizedString | string;
  image: string;
  type: PackageType;
  eventId: ID;
  eventName?: string;
  discount: number;
  groups: PackageGroup[];
};
