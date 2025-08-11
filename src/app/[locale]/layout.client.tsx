// Optimized layout context with better performance and state management
'use client';

import React, { useContext, useState, useCallback, useMemo, useEffect } from 'react';

// Enhanced types with better validation
export interface CartItem {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  image: string;
  quantity: number;
  price?: number; // Added for future pricing features
  category?: string; // Added for better organization
}

export interface CustomerInfo {
  phone: string;
  shopName: string;
  event: string;
  registeredAt?: Date; // Added for tracking
}

interface LayoutContextType {
  // Cart state and actions
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Customer state and actions
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  updateCustomerInfo: (updates: Partial<CustomerInfo>) => void;
  clearCustomerInfo: () => void;
  
  // Computed values
  cartTotal: number;
  cartItemCount: number;
  isCartEmpty: boolean;
  isCustomerLoggedIn: boolean;
}

const LayoutContext = React.createContext<LayoutContextType | null>(null);

// Custom hook with better error handling
export function useLayoutContext(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      'useLayoutContext must be used within a LayoutProvider. ' +
      'Make sure your component is wrapped with <LayoutProvider>.'
    );
  }
  return context;
}

// Default states
const DEFAULT_CUSTOMER_INFO: CustomerInfo = {
  phone: '',
  shopName: '',
  event: '',
};

const STORAGE_KEYS = {
  CART: 'aev-cart',
  CUSTOMER: 'aev-customer',
} as const;

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  // State initialization with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(DEFAULT_CUSTOMER_INFO);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration effect to prevent SSR mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load cart from localStorage
      try {
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        }
      } catch (error) {
        console.warn('Failed to load cart from localStorage:', error);
      }

      // Load customer info from localStorage
      try {
        const savedCustomer = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
        if (savedCustomer) {
          const parsedCustomer = JSON.parse(savedCustomer);
          setCustomerInfo({ ...DEFAULT_CUSTOMER_INFO, ...parsedCustomer });
        }
      } catch (error) {
        console.warn('Failed to load customer info from localStorage:', error);
      }

      setIsHydrated(true);
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
    }
  }, [cart, isHydrated]);

  // Persist customer info to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customerInfo));
      } catch (error) {
        console.warn('Failed to save customer info to localStorage:', error);
      }
    }
  }, [customerInfo, isHydrated]);

  // Optimized cart actions with useCallback
  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Customer actions
  const updateCustomerInfo = useCallback((updates: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...updates }));
  }, []);

  const clearCustomerInfo = useCallback(() => {
    setCustomerInfo(DEFAULT_CUSTOMER_INFO);
  }, []);

  // Memoized computed values
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  const isCartEmpty = useMemo(() => cart.length === 0, [cart]);

  const isCustomerLoggedIn = useMemo(
    () => Boolean(customerInfo.phone && customerInfo.shopName),
    [customerInfo.phone, customerInfo.shopName]
  );

  // Memoized context value
  const contextValue = useMemo(
    (): LayoutContextType => ({
      // Cart state and actions
      cart,
      setCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      
      // Customer state and actions
      customerInfo,
      setCustomerInfo,
      updateCustomerInfo,
      clearCustomerInfo,
      
      // Computed values
      cartTotal,
      cartItemCount,
      isCartEmpty,
      isCustomerLoggedIn,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      customerInfo,
      updateCustomerInfo,
      clearCustomerInfo,
      cartTotal,
      cartItemCount,
      isCartEmpty,
      isCustomerLoggedIn,
    ]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}
