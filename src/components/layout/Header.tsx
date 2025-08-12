
'use client';

import { Logo } from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils';
import Link from 'next/link';
import { useLayoutContext } from '../../app/[locale]/layout.client';
import { User, Phone, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { memo, useCallback, useMemo, useState } from 'react';

// Types for better TypeScript support
interface NavLink {
  href: string;
  label: string;
}

// Constants moved outside component to prevent recreations
const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'home' },
  { href: '/order', label: 'order' },
  { href: '/leaderboard', label: 'leaderboard' },
  { href: '/leaderboard2', label: 'leaderboard2' },
] as const;

// Memoized sub-components for performance
const CustomerInfo = memo(({ customerInfo }: { customerInfo: any }) => {
  if (!customerInfo?.shopName) return null;
  
  return (
    <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>{customerInfo.shopName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>{customerInfo.phone}</span>
      </div>
    </div>
  );
});

CustomerInfo.displayName = 'CustomerInfo';

const CartButton = memo(({ totalQuantity }: { totalQuantity: number }) => (
  <Button asChild variant="ghost" size="icon" className="relative">
    <Link href="/checkout" aria-label={`Shopping cart with ${totalQuantity} items`}>
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {totalQuantity > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 text-xs">
          {totalQuantity > 99 ? '99+' : totalQuantity}
        </Badge>
      )}
      <span className="sr-only">Shopping Cart ({totalQuantity} items)</span>
    </Link>
  </Button>
));

CartButton.displayName = 'CartButton';

const NavigationLink = memo(({ link, pathname, t }: { 
  link: NavLink; 
  pathname: string; 
  t: any; 
}) => (
  <Link
    key={link.href}
    href={link.href}
    className={cn(
      'text-sm font-medium transition-colors hover:text-primary focus:text-primary outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-2 py-1',
      pathname === link.href ? 'text-primary' : 'text-muted-foreground'
    )}
    aria-current={pathname === link.href ? 'page' : undefined}
  >
    {t(link.label as any)}
  </Link>
));

NavigationLink.displayName = 'NavigationLink';

export const Header = memo(() => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');
  const { 
    customerInfo, 
    clearCustomerInfo, 
    clearCart, 
    cartItemCount,
    isCustomerLoggedIn 
  } = useLayoutContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized callbacks for performance
  const handleSignOut = useCallback(() => {
    clearCustomerInfo();
    clearCart();
    router.push('/');
  }, [clearCustomerInfo, clearCart, router]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>

        {/* Mobile Logo */}
        <div className="mr-6 flex md:hidden">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 flex-1" role="navigation">
          {NAV_LINKS.map((link) => (
            <NavigationLink 
              key={link.href}
              link={link}
              pathname={pathname}
              t={t}
            />
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <CustomerInfo customerInfo={customerInfo} />
          <CartButton totalQuantity={cartItemCount} />
          
          {isCustomerLoggedIn && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Sign Out</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4" role="navigation">
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus:text-primary outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md',
                    pathname === link.href ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  )}
                  onClick={closeMobileMenu}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {t(link.label as any)}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';
