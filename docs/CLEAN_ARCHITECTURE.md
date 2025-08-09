# Clean Architecture Implementation Guide

## 🏗️ Architecture Overview

Your AQUA VN project now implements **Complete Clean Architecture** with the following layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   Components    │    │   Pages/Routes  │                    │
│  │   (React/Next)  │    │   (App Router)  │                    │
│  └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   Use Cases     │    │ App Services    │                    │
│  │ (Business Logic)│    │ (Orchestration) │                    │
│  └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────────┐
│                       DOMAIN LAYER                              │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │    Entities     │    │  Value Objects  │                    │
│  │  (Core Models)  │    │   (Primitives)  │                    │
│  └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                           │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │  Repositories   │    │  External APIs  │                    │
│  │  (Data Access)  │    │  (Database/Web) │                    │
│  └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Complete Directory Structure

```
src/
├── domain/                           # Core business logic (innermost layer)
│   ├── entities/                     # Business entities
│   │   ├── Event.ts                 # Event domain entity
│   │   ├── Product.ts               # Product domain entity
│   │   ├── Customer.ts              # Customer domain entity
│   │   ├── Order.ts                 # Order domain entity ✨ NEW
│   │   ├── CheckIn.ts               # CheckIn domain entity ✨ NEW
│   │   ├── Package.ts               # Package domain entity ✨ NEW
│   │   └── LeaderboardEntry.ts      # Leaderboard domain entity ✨ NEW
│   ├── value-objects/               # Immutable value types
│   │   ├── LocalizedText.ts         # Multi-language text
│   │   ├── DateRange.ts             # Date range validation
│   │   └── EventType.ts             # Event type enum
│   ├── repositories/                # Repository interfaces (contracts)
│   │   ├── IEventRepository.ts      # Event repository contract
│   │   ├── IProductRepository.ts    # Product repository contract
│   │   ├── ICustomerRepository.ts   # Customer repository contract
│   │   ├── IOrderRepository.ts      # Order repository contract ✨ NEW
│   │   ├── ICheckInRepository.ts    # CheckIn repository contract ✨ NEW
│   │   ├── IPackageRepository.ts    # Package repository contract ✨ NEW
│   │   └── ILeaderboardRepository.ts # Leaderboard repository contract ✨ NEW
│   └── index.ts                     # Domain layer exports
├── application/                      # Application business rules
│   ├── use-cases/                   # Application-specific business rules
│   │   ├── EventUseCases.ts         # Event business operations
│   │   ├── ProductUseCases.ts       # Product business operations
│   │   ├── OrderUseCases.ts         # Order business operations ✨ NEW
│   │   ├── CheckInUseCases.ts       # CheckIn business operations ✨ NEW
│   │   ├── PackageUseCases.ts       # Package business operations ✨ NEW
│   │   └── LeaderboardUseCases.ts   # Leaderboard business operations ✨ NEW
│   ├── services/                    # Application orchestration
│   │   ├── EventApplicationService.ts     # Event orchestration service
│   │   ├── ProductApplicationService.ts   # Product orchestration service
│   │   ├── CustomerApplicationService.ts  # Customer orchestration service
│   │   ├── OrderApplicationService.ts     # Order orchestration service ✨ NEW
│   │   ├── CheckInApplicationService.ts   # CheckIn orchestration service ✨ NEW
│   │   ├── PackageApplicationService.ts   # Package orchestration service ✨ NEW
│   │   └── LeaderboardApplicationService.ts # Leaderboard orchestration service ✨ NEW
│   └── index.ts                     # Application layer exports
├── infrastructure/                   # External interfaces
│   ├── repositories/                # Repository implementations
│   │   ├── EventRepository.ts       # Event data access implementation
│   │   ├── ProductRepositoryImpl.ts # Product data access implementation
│   │   ├── CustomerRepositoryImpl.ts # Customer data access implementation
│   │   ├── OrderRepositoryImpl.ts   # Order data access implementation ✨ NEW
│   │   ├── CheckInRepositoryImpl.ts # CheckIn data access implementation ✨ NEW
│   │   ├── PackageRepositoryImpl.ts # Package data access implementation ✨ NEW
│   │   └── LeaderboardRepositoryImpl.ts # Leaderboard data access implementation ✨ NEW
│   ├── adapters/                    # Legacy system adapters ✨ NEW
│   │   └── LegacyAdapters.ts        # Bridge to legacy types
│   ├── database/                    # Database configurations
│   └── index.ts                     # Infrastructure layer exports
├── shared/                          # Shared concerns
│   ├── errors/                      # Domain errors
│   │   └── DomainErrors.ts          # Custom error types
│   ├── validation/                  # Input validation
│   └── index.ts                     # Shared layer exports
└── lib/data/                        # Legacy compatibility layer
    └── clean-actions.ts             # Complete server actions using Clean Architecture ✨ UPDATED
```

## 🎯 Key Concepts

### 1. **Domain Entities**

Domain entities are the core business objects that encapsulate business rules and behavior.

```typescript
// Example: Event entity with business logic
export class Event {
  constructor(
    public readonly id: string,
    public readonly name: LocalizedText,
    public readonly type: EventType,
    public readonly dateRange: DateRange,
    public readonly status: boolean
  ) {}

  // Business rules
  public isActive(): boolean {
    return this.status && this.dateRange.isCurrentlyActive();
  }

  public canAcceptOrders(): boolean {
    return this.isActive() && this.type !== EventType.EXPIRED;
  }
}
```

### 2. **Value Objects**

Value objects are immutable types that represent concepts with no identity.

```typescript
// Example: LocalizedText value object
export class LocalizedText {
  constructor(
    public readonly en: string,
    public readonly vi: string
  ) {
    if (!en.trim() || !vi.trim()) {
      throw new Error('Both English and Vietnamese text must be provided');
    }
  }

  public getText(locale: 'en' | 'vi'): string {
    return locale === 'vi' ? this.vi : this.en;
  }
}
```

### 3. **Use Cases**

Use cases contain application-specific business rules and orchestrate the flow of data.

```typescript
// Example: Create Event Use Case
export class CreateEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(request: CreateEventRequest): Promise<Event> {
    // 1. Validate business rules
    const dateRange = new DateRange(request.startDate, request.endDate);
    if (!dateRange.isCurrentlyActive() && request.status) {
      throw new BusinessRuleError('Cannot create an active event with past dates');
    }

    // 2. Create domain entity
    const event = new Event(
      generateId(),
      new LocalizedText(request.name.en, request.name.vi),
      EventType.fromString(request.type),
      dateRange,
      request.status
    );

    // 3. Persist via repository
    return await this.eventRepository.save(event);
  }
}
```

### 4. **Repository Pattern**

Repositories provide an abstraction over data access, allowing the domain to be independent of data storage.

```typescript
// Domain interface (contract)
export interface IEventRepository {
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  save(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}

// Infrastructure implementation
export class EventRepository implements IEventRepository {
  async findAll(): Promise<Event[]> {
    const rawEvents = await this.dataSource.getEvents();
    return rawEvents.map(this.toDomainEntity);
  }
  // ... other methods
}
```

## 🚀 How to Use

### 1. **In Server Actions**

```typescript
'use server';

import { EventApplicationService } from '@/application';

const eventService = new EventApplicationService();

export async function createEventAction(formData: FormData) {
  try {
    const eventData = {
      name: {
        en: formData.get('name_en') as string,
        vi: formData.get('name_vi') as string
      },
      type: formData.get('type') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      status: formData.get('status') === 'true'
    };

    const event = await eventService.createEvent(eventData);
    return event.toPlainObject();
  } catch (error) {
    if (error instanceof DomainError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create event');
  }
}
```

### 2. **In React Components**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getEventsAction, createEventAction } from '@/lib/data/clean-actions';

export function EventManagement() {
  const [events, setEvents] = useState([]);

  const handleCreateEvent = async (formData: FormData) => {
    try {
      await createEventAction(formData);
      // Refresh events list
      const updatedEvents = await getEventsAction();
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ... rest of component
}
```

## 🔧 Benefits

### ✅ **Achieved Benefits**

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Business logic is isolated and easily testable
3. **Maintainability**: Changes in one layer don't affect others
4. **Domain-Driven Design**: Business rules are expressed in code
5. **Type Safety**: Strong typing throughout all layers
6. **Scalability**: Easy to add new features following established patterns

### 🎯 **Business Rules in Code**

Your business rules are now explicitly modeled:

- Events can only be active if they're within their date range
- Localized text must have both English and Vietnamese versions
- Date ranges must have valid start/end dates
- Event types determine available functionality

## 🚀 Next Steps

1. **Complete Migration**: Gradually migrate existing features to Clean Architecture
2. **Add Testing**: Write unit tests for use cases and domain entities
3. **Add Validation**: Implement comprehensive input validation
4. **Performance**: Add caching and optimization where needed
5. **Documentation**: Document business rules and domain concepts

## 📚 Example Usage

To see Clean Architecture in action, check the example component:
- `src/components/examples/CleanArchitectureEventExample.tsx`

This demonstrates how to:
- Use application services in React components
- Handle domain errors gracefully
- Maintain clean separation between UI and business logic

## 🔄 Migration Strategy

1. **Phase 1**: ✅ Set up Clean Architecture structure
2. **Phase 2**: 🔄 Migrate Events (partially complete)
3. **Phase 3**: 🔄 Migrate Products
4. **Phase 4**: 🔄 Migrate Customers
5. **Phase 5**: 🔄 Migrate Orders
6. **Phase 6**: 🔄 Add comprehensive testing
7. **Phase 7**: 🔄 Performance optimization

Your project now has a solid foundation for scalable, maintainable code that follows industry best practices!
