
'use client';

import { useLayoutContext } from '../layout.client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { createOrder } from '@/lib/data/actions';

export default function CheckoutPage() {
  const { cart, customerInfo, setCart } = useLayoutContext();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const content = {
    vi: {
      title: 'Xác nhận đơn hàng',
      description: 'Vui lòng xem lại thông tin đơn hàng của bạn bên dưới.',
      customerInfo: 'Thông tin cửa hàng',
      shopName: 'Tên cửa hàng',
      phone: 'Số điện thoại',
      orderSummary: 'Tóm tắt đơn hàng',
      product: 'Sản phẩm',
      quantity: 'Số lượng',
      total: 'Tổng số lượng',
      confirmOrder: 'Xác nhận & Đặt hàng',
      orderPlaced: 'Đặt hàng thành công!',
      orderPlacedDesc: 'Đơn hàng của bạn đã được ghi nhận.',
      emptyCart: 'Giỏ hàng của bạn trống. Không thể tiến hành thanh toán.',
      backToOrder: 'Quay lại đặt hàng',
      errorPlacingOrder: 'Lỗi',
      errorPlacingOrderDesc: 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.',
    },
    en: {
      title: 'Confirm Your Order',
      description: 'Please review your order details below.',
      customerInfo: 'Shop Information',
      shopName: 'Shop Name',
      phone: 'Phone Number',
      orderSummary: 'Order Summary',
      product: 'Product',
      quantity: 'Quantity',
      total: 'Total Quantity',
      confirmOrder: 'Confirm & Place Order',
      orderPlaced: 'Order Placed!',
      orderPlacedDesc: 'Your order has been successfully recorded.',
      emptyCart: 'Your cart is empty. Cannot proceed to checkout.',
      backToOrder: 'Back to Order',
      errorPlacingOrder: 'Error Placing Order',
      errorPlacingOrderDesc: 'There was an error placing your order. Please try again.',
    },
  };

  const currentContent = content[locale as keyof typeof content];

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    
    try {
        await createOrder({
            shopName: customerInfo.shopName,
            eventId: customerInfo.event,
            products: cart.map(item => ({ id: item.id, quantity: item.quantity })),
            total: totalQuantity,
        });

        toast({
            title: currentContent.orderPlaced,
            description: currentContent.orderPlacedDesc,
            variant: 'success',
        });
        setCart([]);
        router.push('/order');
    } catch (error) {
        console.error('Failed to create order:', error);
        toast({
            title: currentContent.errorPlacingOrder,
            description: currentContent.errorPlacingOrderDesc,
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{currentContent.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{currentContent.emptyCart}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/order')} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                {currentContent.backToOrder}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center relative">
            <Button variant="ghost" className="absolute left-4 top-4" onClick={() => router.back()}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {currentContent.backToOrder}
            </Button>
            <CardTitle className="text-3xl font-headline pt-12 md:pt-0">{currentContent.title}</CardTitle>
            <CardDescription>{currentContent.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentContent.customerInfo}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{currentContent.shopName}:</span>
                  <span className="font-medium">{customerInfo.shopName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{currentContent.phone}:</span>
                  <span className="font-medium">{customerInfo.phone}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{currentContent.orderSummary}</h3>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <p className="font-medium">{item.name[locale as keyof typeof item.name]}</p>
                    <p className="text-muted-foreground">
                      {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <p>{currentContent.total}</p>
                <p className="text-primary">{totalQuantity}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" onClick={handleConfirmOrder}>
              {currentContent.confirmOrder}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
