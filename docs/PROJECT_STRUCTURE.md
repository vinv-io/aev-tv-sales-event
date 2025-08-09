# Project Structure & Best Practices

## 📁 Directory Organization

This project follows Next.js 14 best practices with a clean, scalable folder structure:

```
src/
├── app/                           # Next.js App Router
│   ├── [locale]/                  # Internationalized routes
│   │   ├── layout.client.tsx      # Client-side layout logic
│   │   ├── layout.tsx             # Locale-specific layout
│   │   ├── page.tsx               # Home page
│   │   ├── checkout/              # Checkout flow
│   │   ├── leaderboard/           # Leaderboard pages
│   │   ├── order/                 # Order management
│   │   └── client-wrapper.tsx     # Client component wrapper
│   ├── admin/                     # Admin panel routes
│   │   ├── layout.tsx             # Admin layout
│   │   ├── login/                 # Admin authentication
│   │   └── dashboard/             # Admin dashboard
│   ├── (public)/                  # Public route grouping
│   ├── layout.tsx                 # Root layout with HTML structure
│   ├── page.tsx                   # Root page
│   └── favicon.ico               # Site icon
├── components/                    # Reusable components
│   ├── layout/                    # Layout-specific components
│   │   ├── Header.tsx            # Main navigation header
│   │   ├── Footer.tsx            # Site footer
│   │   └── index.ts              # Barrel exports
│   ├── navigation/                # Navigation components
│   │   ├── LanguageSwitcher.tsx  # i18n language toggle
│   │   └── index.ts              # Barrel exports
│   ├── icons/                     # Icon components
│   │   ├── Logo.tsx              # Brand logo
│   │   └── index.ts              # Barrel exports
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card component
│   │   ├── [...other ui components]
│   │   └── loading-spinner.tsx   # Custom loading component
│   ├── common/                    # Common reusable components
│   │   └── index.ts              # Barrel exports
│   └── index.ts                   # Main component exports
├── features/                      # Feature-based organization
│   ├── admin/                     # Admin-specific features
│   ├── leaderboard/              # Leaderboard functionality
│   ├── orders/                   # Order management
│   └── products/                 # Product features
├── lib/                          # Core library code
│   ├── data/                     # Data access layer
│   │   ├── actions.ts            # Server actions
│   │   ├── db.ts                 # Database utilities
│   │   ├── mock.ts               # Mock data
│   │   ├── postgres.ts           # PostgreSQL operations
│   │   ├── schema.ts             # Database schema
│   │   └── types.ts              # Type definitions
│   ├── constants/                # Application constants
│   │   ├── app.ts                # App configuration
│   │   └── index.ts              # Barrel exports
│   ├── database/                 # Database configuration
│   └── utils/                    # Shared utilities
├── utils/                        # Utility functions
│   ├── cn.ts                     # Class name utilities
│   └── index.ts                  # Utility exports
├── styles/                       # Global styles
│   └── globals.css               # Tailwind CSS + global styles
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection
│   └── use-toast.ts             # Toast notifications
├── ai/                          # AI/Genkit integration
│   ├── dev.ts                   # Development AI setup
│   └── genkit.ts                # Genkit configuration
├── i18n/                        # Internationalization
│   └── routing.ts               # next-intl routing config
└── middleware.ts                # Next.js middleware
```

## 🎯 Key Architectural Decisions

### 1. **Clean Component Organization**
- **`/components/layout/`**: Header, Footer, and layout-specific components
- **`/components/navigation/`**: Navigation-related components
- **`/components/icons/`**: All icon and brand components
- **`/components/ui/`**: shadcn/ui design system components
- **`/components/common/`**: Shared business logic components

### 2. **Feature-Based Structure**
- **`/features/`**: Organized by business domains (admin, orders, products, etc.)
- Each feature can contain its own components, hooks, and utilities
- Promotes modularity and easier maintenance

### 3. **Proper Separation of Concerns**
- **`/utils/`**: Pure utility functions (moved from `/lib/utils`)
- **`/styles/`**: All styling concerns (moved from `/app/globals.css`)
- **`/lib/`**: Core business logic, data access, and configuration
- **`/hooks/`**: Reusable React hooks

### 4. **TypeScript Path Aliases**
```json
{
  "@/*": ["./src/*"],
  "@/components": ["./src/components"],
  "@/utils": ["./src/utils"],
  "@/constants": ["./src/constants"],
  "@/styles": ["./src/styles"],
  "@/lib": ["./src/lib"],
  "@/hooks": ["./src/hooks"],
  "@/features": ["./src/features"]
}
```

## 🚀 Performance Optimizations

### React Performance
- ✅ **React.memo()** for expensive components
- ✅ **useCallback()** for event handlers
- ✅ **useMemo()** for computed values
- ✅ **Lazy loading** with React.lazy()

### Next.js 14 Optimizations
- ✅ **App Router** for modern routing
- ✅ **Server Components** by default
- ✅ **Static Generation** where appropriate
- ✅ **Image Optimization** with next/image
- ✅ **Font Optimization** with next/font

### Bundle Optimization
- ✅ **Tree shaking** with ES modules
- ✅ **Code splitting** at route level
- ✅ **Barrel exports** for clean imports
- ✅ **Dynamic imports** for large dependencies

## 🌐 Internationalization (i18n)

- **next-intl** for robust i18n support
- **Route-based localization** with `[locale]` dynamic segments
- **Middleware** for automatic locale detection
- **Admin routes excluded** from i18n middleware

## 📱 Responsive Design

- **Mobile-first** approach with Tailwind CSS
- **Custom `use-mobile` hook** for responsive logic
- **Flexible component system** adapting to screen sizes

## 🔧 Development Experience

### Import Organization
```typescript
// Clean, predictable imports
import { Header, Footer } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { cn } from '@/utils';
import { APP_CONFIG } from '@/constants';
```

### Component Structure
```typescript
// Consistent component patterns
import { memo, useCallback } from 'react';
import { cn } from '@/utils';

interface ComponentProps {
  // Proper TypeScript interfaces
}

export const Component = memo<ComponentProps>(({
  // Memoized for performance
}) => {
  // Implementation
});
```

## 🎨 Styling Strategy

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent design system
- **CSS Modules** for component-specific styles when needed
- **Global styles** in `/styles/globals.css`

## 📊 Data Management

- **Server Actions** for form submissions
- **PostgreSQL** with Prisma ORM
- **Type-safe** database operations
- **Mock data** for development

## 🔒 Admin Panel

- **Separate route group** (`/admin`)
- **Authentication-protected** routes
- **Dashboard** with analytics and management
- **Excluded from i18n** for admin-specific UX

## ✅ Current Status

✅ **Project structure reorganized** according to best practices  
✅ **All imports updated** to new paths  
✅ **TypeScript configuration** updated with new aliases  
✅ **Development server** running successfully  
✅ **Build process** completing (with minor runtime warnings)  
✅ **Performance optimizations** implemented  
✅ **Component organization** completed  

## 🎨 Toast Notification System

The application uses a comprehensive toast notification system with the following variants:

### **Available Variants**

- **`success`**: Green color with CheckCircle icon for successful operations
- **`destructive`**: Red color with AlertCircle icon for errors and warnings  
- **`default`**: Standard color with Info icon for general notifications

### **Usage Examples**

```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success notification
toast({
  variant: 'success',
  title: 'Success!',
  description: 'Operation completed successfully.'
});

// Error notification
toast({
  variant: 'destructive',
  title: 'Error',
  description: 'Something went wrong.'
});

// Info notification
toast({
  variant: 'default', // or omit variant
  title: 'Info',
  description: 'General information message.'
});
```

### **Features**

- ✅ **Automatic icons** based on variant type
- ✅ **Color-coded styling** (green for success, red for errors)
- ✅ **Responsive design** with proper mobile support
- ✅ **Accessibility** with proper ARIA attributes
- ✅ **Auto-dismiss** functionality with configurable timeout
- ✅ **Internationalization** support for multilingual apps

## 🚀 Next Steps

1. **Feature development** within organized structure
2. **Add unit tests** using organized structure
3. **Performance monitoring** and optimization
4. **Documentation** of component APIs
5. **CI/CD pipeline** setup for deployment

---

This structure provides a solid foundation for scalable development while maintaining clarity and ease of maintenance.
