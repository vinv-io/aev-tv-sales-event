
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, ShoppingCart, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useLayoutContext } from '../layout.client';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/lib/data/actions';
import type { Product } from '@/lib/data/types';


const ITEMS_PER_PAGE = 6;

export default function OrderPage() {
  const { cart, setCart, customerInfo } = useLayoutContext();
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const locale = params.locale as string;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const content = {
    vi: {
      title: 'Sản phẩm có sẵn',
      orderSummary: 'Tóm tắt đơn hàng',
      total: 'Tổng số lượng',
      emptyCart: 'Giỏ hàng của bạn đang trống.',
      checkout: 'Thanh toán',
      addToOrder: 'Thêm vào giỏ',
      searchPlaceholder: 'Tìm kiếm sản phẩm...',
      shopName: 'Tên cửa hàng',
      phone: 'Số điện thoại',
      back: 'Quay lại',
      authRequired: 'Yêu cầu xác thực',
      authRequiredDesc: 'Bạn cần phải đăng nhập để đặt hàng.',
      goToLogin: 'Đi đến trang đăng nhập',
      errorTitle: 'Lỗi',
      loadingProducts: 'Đang tải sản phẩm...',
      loadProductsError: 'Không thể tải sản phẩm. Vui lòng thử lại.',
      addToCartError: 'Không thể thêm sản phẩm vào giỏ hàng.',
      noProductsFound: 'Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn.',
      noProductsAvailable: 'Không có sản phẩm nào khả dụng.',
    },
    en: {
      title: 'Available Products',
      orderSummary: 'Order Summary',
      total: 'Total Quantity',
      emptyCart: 'Your cart is empty.',
      checkout: 'Checkout',
      addToOrder: 'Add to Order',
      searchPlaceholder: 'Search products...',
      shopName: 'Shop Name',
      phone: 'Phone Number',
      back: 'Back',
      authRequired: 'Authentication Required',
      authRequiredDesc: 'You need to check in to place an order.',
      goToLogin: 'Go to Check-in',
      errorTitle: 'Error',
      loadingProducts: 'Loading products...',
      loadProductsError: 'Unable to load products. Please try again.',
      addToCartError: 'Unable to add product to cart.',
      noProductsFound: 'No products found matching your search.',
      noProductsAvailable: 'No products available.',
    },
  };

  const currentContent = content[locale as keyof typeof content];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const prods = await getProducts() as Product[];
        setProducts(prods);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast({
          variant: 'destructive',
          title: currentContent.errorTitle,
          description: currentContent.loadProductsError,
        });
      } finally {
        setIsLoading(false);
      }
    }
    if(customerInfo.phone && customerInfo.shopName) {
        fetchProducts();
    }
  }, [toast, currentContent.errorTitle, currentContent.loadProductsError, customerInfo.phone, customerInfo.shopName]);

  // Early return if user is not authenticated
  if (!customerInfo.phone || !customerInfo.shopName) {
    return (
        <div class="container mx-auto p-4 flex flex-col items-center justify-center text-center h-[60vh]">
            <Card class="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{currentContent.authRequired}</CardTitle>
                    <CardDescription>{currentContent.authRequiredDesc}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={() => router.push('/')} class="w-full">
                        {currentContent.goToLogin}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  const filteredProducts = products.filter(product => {
    const lang = locale as 'vi' | 'en';
    const name = typeof product.name === 'string' ? product.name : product.name[lang];
    const description = typeof product.description === 'string' ? product.description : product.description[lang];

    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleQuantityChange = (productId: string, amount: number) => {
    try {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === productId);
        if (existingItem) {
          const newQuantity = existingItem.quantity + amount;
          if (newQuantity <= 0) {
            return prevCart.filter((item) => item.id !== productId);
          }
          return prevCart.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );
        } else if (amount > 0) {
          const product = products.find((p) => p.id === productId);
          if (product) {
              const productName = typeof product.name === 'string' ? { vi: product.name, en: product.name } : product.name;
              const productDescription = typeof product.description === 'string' ? { vi: product.description, en: product.description } : product.description;

              return [...prevCart, { ...product, name: productName, description: productDescription, quantity: 1 }];
          }
        }
        return prevCart;
      });
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast({
        variant: 'destructive',
        title: currentContent.errorTitle,
        description: currentContent.addToCartError,
      });
    }
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        variant: 'destructive',
        title: currentContent.errorTitle,
        description: currentContent.emptyCart,
      });
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle className="text-2xl font-headline">{currentContent.title}</CardTitle>
                    </div>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder={currentContent.searchPlaceholder}
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </CardHeader>
          </Card>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="flex flex-col animate-pulse">
                  <CardHeader>
                    <div className="w-full h-48 bg-muted rounded-t-lg"></div>
                    <div className="space-y-2 pt-4">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow"></CardContent>
                  <CardFooter>
                    <div className="h-10 bg-muted rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? currentContent.noProductsFound : currentContent.noProductsAvailable}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedProducts.map((product) => {
              const cartItem = cart.find((item) => item.id === product.id);
              const productName = typeof product.name === 'string' ? product.name : product.name[locale as keyof typeof product.name];
              const productDescription = typeof product.description === 'string' ? product.description : product.description[locale as keyof typeof product.description];

              return (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader>
                    <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                      <Image src={product.image} alt={productName} layout="fill" objectFit="cover" data-ai-hint={product.aiHint} />
                    </div>
                    <CardTitle className="pt-4">{productName}</CardTitle>
                    <CardDescription>{productDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                  </CardContent>
                  <CardFooter>
                    {cartItem ? (
                      <div className="flex items-center gap-2 w-full">
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(product.id, -1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg w-12 text-center">{cartItem.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(product.id, 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleQuantityChange(product.id, 1)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {currentContent.addToOrder}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          )}
           {!isLoading && paginatedProducts.length > 0 && (
             <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages <= 1}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
           )}
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{currentContent.orderSummary}</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-muted-foreground">{currentContent.emptyCart}</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name[locale as keyof typeof item.name]}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleQuantityChange(item.id, -item.quantity)}>
                              <Trash2 className="h-4 w-4"/>
                          </Button>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <p>{currentContent.total}</p>
                    <p className="text-primary">{totalQuantity}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCheckout} disabled={cart.length === 0}>
                {currentContent.checkout}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
