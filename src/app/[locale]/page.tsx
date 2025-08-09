'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLayoutContext } from './layout.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getActiveEvents, createCustomer, findCustomerByPhone, createCheckIn } from '@/lib/data/actions';
import type { Event, Customer } from '@/lib/data/types';

interface Props {
  params: {locale: string};
}

export default function CheckInPage({ params }: Props) {
  const { locale } = params;
  const t = useTranslations();
  const { setCustomerInfo, customerInfo } = useLayoutContext();
  const router = useRouter();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [activeAndSortedEvents, setActiveAndSortedEvents] = useState<Event[]>([]);
  const [event, setEvent] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content based on locale
  const content = {
    vi: {
      title: 'Chào mừng đến với AQUA VN',
      description: 'Nhập thông tin của bạn để bắt đầu đặt hàng.',
      eventLabel: 'Chọn sự kiện',
      eventPlaceholder: 'Chọn một sự kiện',
      phoneLabel: 'Số điện thoại',
      phonePlaceholder: 'Nhập số điện thoại của bạn',
      phoneTitle: 'Số điện thoại phải có 10 chữ số',
      shopLabel: 'Tên cửa hàng',
      shopPlaceholder: 'Nhập tên cửa hàng của bạn',
      buttonText: 'Tiếp tục đặt hàng',
      requiredField: 'Vui lòng điền vào trường này.',
      errorTitle: 'Lỗi xác thực',
      errorEvent: 'Vui lòng chọn một sự kiện.',
      errorPhone: 'Vui lòng nhập một số điện thoại hợp lệ.',
      errorShopName: 'Vui lòng nhập tên cửa hàng của bạn.',
      checkinSuccess: 'Check-in thành công!',
      checkinError: 'Lỗi Check-in',
      checkinErrorDesc: 'Đã xảy ra lỗi khi check-in. Vui lòng thử lại.',
    },
    en: {
      title: 'Welcome to AQUA VN',
      description: 'Enter your details to start your order.',
      eventLabel: 'Select Event',
      eventPlaceholder: 'Choose an event',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      phoneTitle: 'Phone number must be 10 digits',
      shopLabel: 'Shop Name',
      shopPlaceholder: 'Enter your shop name',
      buttonText: 'Proceed to Order',
      requiredField: 'Please fill out this field.',
      errorTitle: 'Validation Error',
      errorEvent: 'Please select an event.',
      errorPhone: 'Please enter a valid phone number.',
      errorShopName: 'Please enter your shop name.',
      checkinSuccess: 'Check-in successful!',
      checkinError: 'Check-in Error',
      checkinErrorDesc: 'There was an error checking in. Please try again.',
    },
  };

  const currentContent = content[locale as keyof typeof content] || content.en;

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getActiveEvents() as Event[];
        const sorted = fetchedEvents
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setEvents(fetchedEvents);
        setActiveAndSortedEvents(sorted);
        if (sorted.length > 0) {
          setEvent(sorted[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Check for existing customer when phone changes
  useEffect(() => {
    const checkCustomer = async () => {
      if (phone.length === 10) {
        try {
          const customer = await findCustomerByPhone(phone) as Customer | undefined;
          if (customer) {
            setShopName(customer.shopName);
            setExistingCustomer(customer);
          } else {
            setShopName('');
            setExistingCustomer(null);
          }
        } catch (error) {
          console.error('Failed to check customer:', error);
        }
      }
    };
    checkCustomer();
  }, [phone]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!event) {
        toast({
          variant: 'destructive',
          title: currentContent.errorTitle,
          description: currentContent.errorEvent,
        });
        setIsSubmitting(false);
        return;
      }
      if (!phone || phone.length !== 10) {
        toast({
          variant: 'destructive',
          title: currentContent.errorTitle,
          description: currentContent.errorPhone,
        });
        setIsSubmitting(false);
        return;
      }
      if (!shopName.trim()) {
        toast({
          variant: 'destructive',
          title: currentContent.errorTitle,
          description: currentContent.errorShopName,
        });
        setIsSubmitting(false);
        return;
      }

      // Create or find customer
      let customerToUse = existingCustomer;
      if (!customerToUse) {
        customerToUse = await createCustomer({ phone, shopName: shopName.trim() });
      }

      if (!customerToUse) {
        throw new Error("Failed to create or find customer.");
      }

      // Create check-in
      await createCheckIn({
        customerId: customerToUse.id,
        shopName: customerToUse.shopName,
        phone: customerToUse.phone,
        eventId: event,
      });

      // Update context and navigate
      const customerData = {
        event,
        phone,
        shopName: shopName.trim(),
      };
      
      setCustomerInfo(customerData);
      toast({ 
        variant: 'success',
        title: currentContent.checkinSuccess 
      });
      router.push('/order');

    } catch (error) {
      console.error("Check-in failed:", error);
      toast({
        variant: 'destructive',
        title: currentContent.errorTitle,
        description: currentContent.checkinErrorDesc,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [event, phone, shopName, existingCustomer, currentContent, setCustomerInfo, toast, router]);

  return (
    <div 
      className="flex flex-grow items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://aquavietnam.com.vn/wp-content/uploads/2025/07/AQUA-5-door_1-scaled.jpg')" }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-center">{currentContent.title}</CardTitle>
            <CardDescription className="text-center">{currentContent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="event">{currentContent.eventLabel}</Label>
                <Select name="event" value={event} onValueChange={setEvent}>
                  <SelectTrigger id="event">
                    <SelectValue placeholder={currentContent.eventPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeAndSortedEvents.map(event => {
                      const eventName = typeof event.name === 'string' ? event.name : event.name[locale as keyof typeof event.name];
                      return (<SelectItem key={event.id} value={event.id}>{eventName}</SelectItem>);
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">{currentContent.phoneLabel}</Label>
                <Input 
                  id="phone" 
                  placeholder={currentContent.phonePlaceholder} 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={10}
                  title={currentContent.phoneTitle}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="shop-name">{currentContent.shopLabel}</Label>
                <Input 
                  id="shop-name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder={currentContent.shopPlaceholder} 
                  disabled={!!existingCustomer}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : currentContent.buttonText}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
