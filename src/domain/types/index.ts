// Domain Types - Core business types
// These types represent the domain concepts and should be independent of any external concerns

// Core Domain Types
export interface DomainId {
  readonly value: string;
}

export interface Timestamps {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Localization Support
export interface LocalizedContent {
  readonly en: string;
  readonly vi: string;
}

// Event Domain Types
export interface EventData {
  readonly id: string;
  readonly name: LocalizedContent;
  readonly description?: LocalizedContent;
  readonly startDate: string;
  readonly endDate: string;
  readonly status: boolean;
  readonly image?: string;
}

// Product Domain Types
export interface ProductData {
  readonly id: string;
  readonly name: LocalizedContent;
  readonly description: LocalizedContent;
  readonly image: string;
  readonly category: string;
  readonly isActive: boolean;
}

// Customer Domain Types
export interface CustomerData {
  readonly id: string;
  readonly phone: string;
  readonly shopName: string;
  readonly joined: string;
}

// Order Domain Types
export interface OrderData {
  readonly id: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly products: OrderProduct[];
  readonly totalAmount: number;
  readonly orderDate: string;
  readonly status: OrderStatus;
  readonly notes?: string;
}

export interface OrderProduct {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly price?: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// CheckIn Domain Types
export interface CheckInData {
  readonly id: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly shopName: string;
  readonly eventId: string;
  readonly checkInDate: string;
  readonly notes?: string;
}

// Package Domain Types
export interface PackageData {
  readonly id: string;
  readonly name: LocalizedContent;
  readonly description: LocalizedContent;
  readonly price: number;
  readonly products: string[]; // Product IDs
  readonly isActive: boolean;
  readonly validFrom: string;
  readonly validTo: string;
}

// Leaderboard Domain Types
export interface LeaderboardData {
  readonly customerId: string;
  readonly customerName: string;
  readonly shopName: string;
  readonly totalOrders: number;
  readonly totalAmount: number;
  readonly rank: number;
  readonly period: string;
}

// Business Rules Types
export interface BusinessRule<T> {
  validate(entity: T): boolean;
  getErrorMessage(): string;
}

// Domain Events
export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly data: Record<string, unknown>;
}

// Common Value Objects
export interface Money {
  readonly amount: number;
  readonly currency: string;
}

export interface DateRange {
  readonly start: Date;
  readonly end: Date;
}

export interface PhoneNumber {
  readonly value: string;
  readonly countryCode?: string;
}

// Error Types
export type DomainErrorType = 
  | 'VALIDATION_ERROR'
  | 'BUSINESS_RULE_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'UNAUTHORIZED_ERROR'
  | 'CONFLICT_ERROR';

export interface DomainErrorInfo {
  readonly type: DomainErrorType;
  readonly message: string;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
}
