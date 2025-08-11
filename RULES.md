# 🤖 AI Coding Rules for AEV TV Sales Event

This document contains comprehensive rules and guidelines for AI assistants working on this project. These rules ensure consistency, maintainability, and adherence to the established clean architecture.

## 📋 Table of Contents

- [Clean Architecture Rules](#clean-architecture-rules)
- [React & Next.js Rules](#react--nextjs-rules)
- [Database & Data Layer Rules](#database--data-layer-rules)
- [Styling & UI Rules](#styling--ui-rules)
- [File Organization Rules](#file-organization-rules)
- [TypeScript Rules](#typescript-rules)
- [Performance Rules](#performance-rules)
- [Internationalization Rules](#internationalization-rules)
- [Security Rules](#security-rules)
- [Package & Dependency Rules](#package--dependency-rules)
- [Docker & Deployment Rules](#docker--deployment-rules)
- [Code Quality Rules](#code-quality-rules)

---

## 🏗️ Clean Architecture Rules

### **CRITICAL: Always Follow Clean Architecture Layers**

1. **Domain Layer (`src/domain/`)**
   - **Entities**: Pure business objects with business rules
   - **Value Objects**: Immutable objects representing domain concepts
   - **Repository Interfaces**: Contracts for data access
   - **Domain Types**: Centralized type definitions
   - **Rule**: Domain layer has NO dependencies on other layers

2. **Application Layer (`src/application/`)**
   - **Use Cases**: Single-purpose business operations
   - **Application Services**: Orchestrate multiple use cases
   - **Rule**: Can depend on Domain, but NOT on Infrastructure or Presentation

3. **Infrastructure Layer (`src/infrastructure/`)**
   - **Repository Implementations**: Data access implementations
   - **Database Configuration**: Connection and schema setup
   - **External Services**: Third-party integrations
   - **Rule**: Implements domain interfaces, depends on Domain and Application

4. **Presentation Layer (`src/presentation/`)**
   - **Server Actions**: Next.js server-side form handlers
   - **API Routes**: REST endpoint implementations
   - **Rule**: Can depend on all other layers for orchestration

### **MANDATORY: Use Clean Architecture Imports**

```typescript
// ✅ CORRECT: Use clean architecture imports
import { EventApplicationService } from '@/application';
import { Event } from '@/domain/entities';
import { createEventAction } from '@/presentation/server-actions/clean-actions';

// ❌ WRONG: Don't use legacy imports
import { createEvent } from '@/lib/data/actions';
import { EventService } from '@/services/events';
```

### **REQUIRED: Server Actions Pattern**

```typescript
'use server';

import { EventApplicationService } from '@/application';
import { DomainError } from '@/shared/errors';

export async function createEventAction(formData: FormData) {
  try {
    const eventService = new EventApplicationService();
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
    return { success: true, data: event.toPlainObject() };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create event' };
  }
}
```

---

## ⚛️ React & Next.js Rules

### **Next.js 14 App Router Requirements**

1. **MUST use App Router** - No Pages Router
2. **Server Components by default** - Only use 'use client' when absolutely necessary
3. **Route groups**: Use `(public)` and `(admin)` for organization
4. **File conventions**: Follow Next.js 14 file conventions exactly

### **React Component Rules**

```typescript
// ✅ CORRECT: Functional component with proper TypeScript
import { memo, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ComponentProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onAction?: () => void;
}

export const Component = memo<ComponentProps>(({ 
  children, 
  variant = 'primary',
  onAction 
}) => {
  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction]);

  return (
    <div className={cn('base-styles', {
      'primary-styles': variant === 'primary',
      'secondary-styles': variant === 'secondary'
    })}>
      {children}
    </div>
  );
});

Component.displayName = 'Component';
```

### **Server Component vs Client Component Rules**

```typescript
// ✅ Server Component (default) - for data fetching
export default async function Page() {
  const events = await getEvents(); // Direct DB access OK
  return <EventList events={events} />;
}

// ✅ Client Component - only when needed
'use client';
export function InteractiveComponent() {
  const [state, setState] = useState();
  // Interactive logic here
}
```

---

## 🗄️ Database & Data Layer Rules

### **CRITICAL: Use Clean Architecture for Data Access**

```typescript
// ✅ CORRECT: Use Application Services
import { EventApplicationService } from '@/application';

const eventService = new EventApplicationService();
const events = await eventService.getAllEvents();

// ❌ WRONG: Direct database access
import { db } from '@/lib/database';
const events = await db.event.findMany();
```

### **Prisma Rules**

1. **Schema Changes**: Always generate migrations with `npm run db:migrate`
2. **Type Safety**: Use Prisma generated types, but wrap in domain types
3. **Connection Pooling**: Use Supabase pgBouncer in production
4. **Transactions**: Use Prisma transactions for multi-table operations

```typescript
// ✅ CORRECT: Repository implementation
export class EventRepository implements IEventRepository {
  async save(event: Event): Promise<Event> {
    const data = await db.event.create({
      data: {
        id: event.id,
        nameEn: event.name.en,
        nameVi: event.name.vi,
        type: event.type.value,
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate,
        status: event.status
      }
    });
    
    return Event.fromPrisma(data);
  }
}
```

---

## 🎨 Styling & UI Rules

### **Tailwind CSS Requirements**

1. **MUST use Tailwind classes** - No inline styles except for dynamic values
2. **Use shadcn/ui components** - Don't reinvent existing UI components
3. **Responsive design**: Mobile-first approach with Tailwind breakpoints
4. **Use `cn()` utility** for conditional classes

```typescript
// ✅ CORRECT: Tailwind with conditional classes
import { cn } from '@/utils';

<button 
  className={cn(
    'px-4 py-2 rounded-md font-medium transition-colors',
    'hover:bg-opacity-90 focus:outline-none focus:ring-2',
    {
      'bg-blue-600 text-white': variant === 'primary',
      'bg-gray-200 text-gray-900': variant === 'secondary',
      'opacity-50 cursor-not-allowed': disabled
    }
  )}
  disabled={disabled}
>
  {children}
</button>
```

### **shadcn/ui Component Rules**

```typescript
// ✅ CORRECT: Import shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// ✅ CORRECT: Use proper variants
<Button variant="outline" size="sm">
  Cancel
</Button>
```

---

## 📁 File Organization Rules

### **MANDATORY: Directory Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── admin/             # Admin panel
│   └── (public)/          # Public routes
├── domain/                # Clean Architecture: Domain Layer
│   ├── entities/          # Business entities
│   ├── value-objects/     # Value objects
│   ├── repositories/      # Repository interfaces
│   └── types/            # Domain type definitions
├── application/           # Clean Architecture: Application Layer
│   ├── use-cases/        # Business use cases
│   └── services/         # Application services
├── infrastructure/        # Clean Architecture: Infrastructure Layer
│   ├── repositories/     # Repository implementations
│   ├── database/         # Database configuration
│   └── adapters/         # External service adapters
├── presentation/          # Clean Architecture: Presentation Layer
│   ├── server-actions/   # Next.js server actions
│   └── api/             # API route handlers
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── navigation/      # Navigation components
└── shared/              # Shared utilities and types
```

### **File Naming Rules**

1. **PascalCase**: React components (`EventCard.tsx`)
2. **camelCase**: Functions, variables, files (`createEvent.ts`)
3. **kebab-case**: Page routes (`event-details/page.tsx`)
4. **UPPER_CASE**: Constants (`API_ENDPOINTS`)

### **Import Organization**

```typescript
// 1. React/Next.js imports
import { useState } from 'react';
import { redirect } from 'next/navigation';

// 2. Third-party imports
import { z } from 'zod';

// 3. Clean Architecture imports (prioritized)
import { EventApplicationService } from '@/application';
import { Event } from '@/domain/entities';

// 4. Internal imports
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';

// 5. Type imports (last)
import type { ComponentProps } from 'react';
```

---

## 🔧 TypeScript Rules

### **Strict Type Safety**

1. **NO `any` types** - Use proper types or `unknown`
2. **Import types**: Use `import type` for type-only imports
3. **Interface over type**: Prefer interfaces for object shapes
4. **Generic constraints**: Use proper generic constraints

```typescript
// ✅ CORRECT: Proper TypeScript
interface EventData {
  id: string;
  name: LocalizedText;
  type: EventType;
  dateRange: DateRange;
  status: boolean;
}

// ✅ CORRECT: Generic with constraints
interface Repository<T extends Entity> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
}

// ❌ WRONG: Using any
const data: any = getEventData();
```

### **Path Aliases (Required)**

Use the configured TypeScript path aliases:

```typescript
// ✅ CORRECT: Use path aliases
import { EventApplicationService } from '@/application';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

// ❌ WRONG: Relative imports for aliased paths
import { EventApplicationService } from '../../../application';
```

---

## 🚀 Performance Rules

### **React Performance**

1. **Use `memo()`** for expensive components
2. **Use `useCallback()`** for event handlers passed to children
3. **Use `useMemo()`** for expensive calculations
4. **Lazy load** heavy components with `React.lazy()`

```typescript
// ✅ CORRECT: Performance optimized component
const ExpensiveComponent = memo<Props>(({ data, onUpdate }) => {
  const expensiveValue = useMemo(() => {
    return heavyCalculation(data);
  }, [data]);

  const handleUpdate = useCallback((newValue: string) => {
    onUpdate(newValue);
  }, [onUpdate]);

  return <div>{expensiveValue}</div>;
});
```

### **Next.js Performance**

1. **Server Components**: Default choice for static content
2. **Static Generation**: Use when possible with `generateStaticParams`
3. **Image Optimization**: Always use `next/image`
4. **Dynamic Imports**: For heavy client-side libraries

---

## 🌐 Internationalization Rules

### **next-intl Integration**

1. **Use `next-intl`** for all user-facing text
2. **Route-based locales**: `/en/...` and `/vi/...`
3. **Exclude admin routes** from i18n middleware
4. **Centralized translations**: Use `/messages/` directory

```typescript
// ✅ CORRECT: i18n usage
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### **Localized Text Value Object**

```typescript
// ✅ CORRECT: Use domain value object
import { LocalizedText } from '@/domain/value-objects';

const eventName = new LocalizedText(
  formData.get('name_en') as string,
  formData.get('name_vi') as string
);
```

---

## 🔒 Security Rules

### **Authentication & Authorization**

1. **Admin routes**: Must be protected with authentication middleware
2. **Environment variables**: Never commit secrets to git
3. **Input validation**: Always validate with Zod schemas
4. **SQL injection**: Use Prisma parameterized queries only

```typescript
// ✅ CORRECT: Input validation
import { z } from 'zod';

const CreateEventSchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_vi: z.string().min(1, 'Vietnamese name is required'),
  type: z.enum(['SALE', 'SPECIAL', 'PROMOTION']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.boolean()
});

export async function createEventAction(formData: FormData) {
  const data = CreateEventSchema.parse({
    name_en: formData.get('name_en'),
    name_vi: formData.get('name_vi'),
    // ... other fields
  });
  
  // Use validated data
}
```

---

## 📦 Package & Dependency Rules

### **Dependencies**

1. **Use exact versions** for critical dependencies
2. **Regular updates**: Keep dependencies up to date
3. **Bundle analysis**: Monitor bundle size impact
4. **Peer dependencies**: Install required peer deps

### **Available Packages**

- **UI**: `@radix-ui/*`, `class-variance-authority`, `clsx`
- **Forms**: `react-hook-form`, `@hookform/resolvers`
- **Database**: `@prisma/client`, `prisma`
- **Validation**: `zod`
- **i18n**: `next-intl`
- **Styling**: `tailwindcss`, `tailwind-merge`

---

## 🐳 Docker & Deployment Rules

### **Environment Configuration**

1. **Single `.env` file** - No separate dev/prod env files
2. **NODE_ENV**: Set appropriately for each environment
3. **Database URLs**: Use connection pooling in production
4. **Docker**: Multi-stage builds for optimization

### **Scripts**

```bash
# Development
npm run dev          # Start development server
npm run typecheck    # Check TypeScript
npm run lint        # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate  # Run migrations
npm run db:studio   # Open Prisma Studio

# Production
npm run build       # Build for production
npm run start       # Start production server
```

---

## ✅ Code Quality Rules

### **MANDATORY: Error Handling**

```typescript
// ✅ CORRECT: Proper error handling in server actions
export async function createEventAction(formData: FormData) {
  try {
    const eventService = new EventApplicationService();
    const result = await eventService.createEvent(eventData);
    revalidatePath('/admin/events');
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof DomainError) {
      return { success: false, error: error.message };
    }
    console.error('Unexpected error creating event:', error);
    return { success: false, error: 'Failed to create event' };
  }
}
```

### **REQUIRED: Documentation**

1. **JSDoc comments** for all public functions
2. **README updates** for significant changes
3. **Type documentation** for complex interfaces
4. **Business rule documentation** in domain layer

### **Testing Requirements**

1. **Unit tests** for domain entities and use cases
2. **Integration tests** for repository implementations
3. **E2E tests** for critical user flows
4. **Type checking** with `npm run typecheck`

### **Linting Rules**

1. **ESLint**: Follow all rules, no disabled rules without justification
2. **Prettier**: Automatic formatting, don't override
3. **TypeScript**: Strict mode enabled
4. **Import sorting**: Follow the specified order

---

## 🚨 CRITICAL RULES SUMMARY

### **DO:**

- ✅ Use Clean Architecture patterns for all new code
- ✅ Import from `@/application`, `@/domain`, `@/infrastructure`, `@/presentation`
- ✅ Use TypeScript strictly (no `any` types)
- ✅ Follow Next.js 14 App Router conventions
- ✅ Use server actions for form submissions
- ✅ Validate all inputs with Zod
- ✅ Use shadcn/ui components
- ✅ Follow mobile-first responsive design
- ✅ Use next-intl for internationalization

### **DON'T:**

- ❌ Use legacy imports from `@/lib/data/actions` or `@/services/*`
- ❌ Access database directly in React components
- ❌ Use inline styles (use Tailwind)
- ❌ Use class components (functional only)
- ❌ Commit environment files with secrets
- ❌ Disable ESLint rules without justification
- ❌ Use `any` types in TypeScript
- ❌ Create new UI components (use shadcn/ui first)

---

**This project follows Clean Architecture principles. Always prioritize the clean architecture imports and patterns over legacy code patterns.**
