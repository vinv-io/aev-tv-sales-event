# 🏗️ Clean Architecture Organization

This document explains the reorganized clean architecture structure of the application.

## 📁 Directory Structure

```
src/
├── 🎯 domain/                          # CORE BUSINESS LOGIC (Inner Layer)
│   ├── entities/                      # Business entities with behavior
│   ├── value-objects/                 # Immutable value types
│   ├── repositories/                  # Repository interfaces (contracts)
│   ├── types/                         # Domain type definitions
│   └── index.ts                       # Domain layer exports
│
├── 🔄 application/                     # APPLICATION BUSINESS RULES
│   ├── use-cases/                     # Application-specific business rules
│   ├── services/                      # Application orchestration services
│   └── index.ts                       # Application layer exports
│
├── 🔌 infrastructure/                  # EXTERNAL CONCERNS (Outer Layer)
│   ├── repositories/                  # Repository implementations
│   ├── adapters/                      # Legacy and external adapters
│   ├── database/                      # Database configuration
│   └── index.ts                       # Infrastructure layer exports
│
├── 🖼️ presentation/                    # USER INTERFACE & API (Outer Layer)
│   ├── server-actions/                # Next.js Server Actions
│   ├── api/                          # API routes (future)
│   └── index.ts                       # Presentation layer exports
│
├── 🤝 shared/                         # SHARED UTILITIES
│   ├── errors/                        # Domain and application errors
│   └── utils/                         # Shared utility functions
│
├── 📱 app/                            # NEXT.JS APP ROUTER (UI Layer)
│   ├── (public)/                     # Public pages
│   ├── [locale]/                     # Internationalized pages
│   ├── admin/                        # Admin interface
│   └── api/                          # API routes
│
├── 🧩 components/                     # REACT COMPONENTS
│   ├── ui/                           # Base UI components
│   ├── forms/                        # Form components
│   ├── layout/                       # Layout components
│   └── examples/                     # Example components
│
├── 🎨 styles/                         # STYLING
├── 🔧 utils/                          # UTILITY FUNCTIONS
├── 🌐 i18n/                           # INTERNATIONALIZATION
├── 🎣 hooks/                          # REACT HOOKS
├── 🏛️ lib/                            # LEGACY CODE (being migrated)
├── 📊 services/                       # LEGACY SERVICES (being migrated)
├── 📝 types/                          # LEGACY TYPES (being migrated)
│
└── clean-architecture.ts              # 🎯 MAIN CLEAN ARCHITECTURE EXPORT
```

## 🎯 Layer Dependencies

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  (UI, Server Actions, API Routes)                       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                   │
│  (Database, External APIs, Repository Implementations)  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                   APPLICATION LAYER                     │
│  (Use Cases, Application Services, Orchestration)       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                     DOMAIN LAYER                        │
│  (Entities, Value Objects, Business Rules)              │
└─────────────────────────────────────────────────────────┘
```

## 🚀 How to Use

### 1. **For New Features**

Use the clean architecture layers:

```typescript
// Import from the main clean architecture export
import { 
  EventApplicationService,
  ProductApplicationService,
  // ... other services
} from '@/clean-architecture';

// Or import from specific layers
import { Event, Product } from '@/domain';
import { CreateEventUseCase } from '@/application';
import { EventRepositoryImpl } from '@/infrastructure';
import { createEventAction } from '@/presentation';
```

### 2. **For Server Actions**

```typescript
// Use the clean server actions
import { createEventAction, getEventsAction } from '@/presentation/server-actions/clean-actions';

// Instead of legacy actions
// import { createEvent } from '@/lib/data/actions'; // ❌ Legacy
```

### 3. **For React Components**

```typescript
'use client';

import { createEventAction } from '@/presentation';

export function EventForm() {
  const handleSubmit = async (formData: FormData) => {
    try {
      await createEventAction(formData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form action={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## 🔄 Migration Strategy

### Current Status:
- ✅ **Domain Layer**: Complete with entities, value objects, and repository interfaces
- ✅ **Application Layer**: Complete with use cases and application services
- ✅ **Infrastructure Layer**: Complete with repository implementations
- ✅ **Presentation Layer**: Clean server actions available
- 🔄 **Legacy Code**: Still present for backward compatibility

### Migration Steps:

1. **New Features**: Always use clean architecture layers
2. **Existing Features**: Gradually migrate from legacy to clean architecture
3. **Remove Legacy**: Once migration is complete, remove legacy code

### Files to Migrate:

#### High Priority (Core Business Logic):
- `src/lib/data/actions.ts` → `src/presentation/server-actions/clean-actions.ts` ✅ DONE
- `src/services/*` → Use `src/application/services/*` instead
- `src/lib/data/postgres.ts` → `src/infrastructure/adapters/legacy-postgres-adapter.ts` ✅ DONE

#### Medium Priority (Supporting Code):
- `src/types/*` → `src/domain/types/*` (partially done)
- `src/lib/database/*` → `src/infrastructure/database/*` ✅ DONE

#### Low Priority (UI Layer):
- Update imports in React components to use clean architecture exports

## 📋 Benefits of This Organization

### ✅ **Clear Separation of Concerns**
- Each layer has a single, well-defined responsibility
- Dependencies flow inward (presentation → infrastructure → application → domain)

### ✅ **Testability**
- Business logic is isolated and easily testable
- Use cases can be unit tested without external dependencies

### ✅ **Maintainability**
- Changes in one layer don't affect others
- Easy to modify or replace implementations

### ✅ **Scalability**
- New features follow established patterns
- Easy to add new entities, use cases, or repositories

### ✅ **Type Safety**
- Strong typing throughout all layers
- Domain types ensure business rule compliance

### ✅ **Migration Support**
- Legacy code is preserved during transition
- Gradual migration without breaking changes

## 🎯 Best Practices

### 1. **Always Start with Domain**
- Define entities and business rules first
- Create value objects for complex data types
- Define repository interfaces

### 2. **Use Cases for Business Logic**
- One use case per business operation
- Keep use cases focused and single-purpose
- Validate business rules in use cases

### 3. **Application Services for Orchestration**
- Coordinate multiple use cases
- Handle cross-cutting concerns
- Provide simple API for presentation layer

### 4. **Repository Pattern for Data Access**
- Always use repository interfaces in domain/application layers
- Implement concrete repositories in infrastructure layer
- Keep data access logic separate from business logic

### 5. **Clean Server Actions for Presentation**
- Use clean architecture server actions for new features
- Handle errors gracefully
- Validate input data

## 🔧 Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Development
npm run dev

# Build
npm run build
```

## 📚 Further Reading

- [docs/CLEAN_ARCHITECTURE.md](../docs/CLEAN_ARCHITECTURE.md) - Detailed implementation guide
- [docs/CLEAN_ARCHITECTURE_MIGRATION.md](../docs/CLEAN_ARCHITECTURE_MIGRATION.md) - Migration status and guide

---

*This organization follows Robert C. Martin's Clean Architecture principles, ensuring maintainable, testable, and scalable code.*
