'use client';

import { useState, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import { useLayoutContext } from '@/app/[locale]/layout.client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorDisplay } from '@/components/ui/error-display';
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor';
import { Phone, Store, Calendar } from 'lucide-react';

// Form validation schema
interface FormData {
  phone: string;
  shopName: string;
  event: string;
}

interface FormErrors {
  phone?: string;
  shopName?: string;
  event?: string;
}

const EVENT_OPTIONS = [
  { value: 'tv-promotion-2024', label: 'TV Promotion 2024' },
  { value: 'summer-sale', label: 'Summer Sale' },
  { value: 'back-to-school', label: 'Back to School' },
] as const;

// Phone validation function
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Form validation
const validateForm = (data: FormData, t: any): FormErrors => {
  const errors: FormErrors = {};

  if (!data.phone.trim()) {
    errors.phone = t('validation.phoneRequired');
  } else if (!validatePhone(data.phone)) {
    errors.phone = t('validation.phoneInvalid');
  }

  if (!data.shopName.trim()) {
    errors.shopName = t('validation.shopNameRequired');
  }

  if (!data.event) {
    errors.event = t('validation.eventRequired');
  }

  return errors;
};

// Memoized input components
const PhoneInput = memo(({ 
  value, 
  onChange, 
  disabled, 
  t 
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  t: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor="phone" className="text-sm font-medium">
      <Phone className="inline h-4 w-4 mr-2" />
      {t('customer.phone')}
      <span className="text-destructive ml-1">*</span>
    </Label>
    <Input
      id="phone"
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0123456789"
      disabled={disabled}
    />
  </div>
));

PhoneInput.displayName = 'PhoneInput';

const ShopNameInput = memo(({ 
  value, 
  onChange, 
  disabled, 
  t 
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  t: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor="shopName" className="text-sm font-medium">
      <Store className="inline h-4 w-4 mr-2" />
      {t('customer.shopName')}
      <span className="text-destructive ml-1">*</span>
    </Label>
    <Input
      id="shopName"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('placeholders.shopName', { default: 'Enter your shop name' })}
      disabled={disabled}
    />
  </div>
));

ShopNameInput.displayName = 'ShopNameInput';

const EventSelect = memo(({ 
  value, 
  onChange, 
  disabled, 
  t 
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  t: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor="event" className="text-sm font-medium">
      <Calendar className="inline h-4 w-4 mr-2" />
      {t('customer.event')}
      <span className="text-destructive ml-1">*</span>
    </Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={t('placeholders.event', { default: 'Select an event' })} />
      </SelectTrigger>
      <SelectContent>
        {EVENT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {t(`events.${option.value}`, { default: option.label })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
));

EventSelect.displayName = 'EventSelect';

export const CheckInForm = memo(() => {
  const t = useTranslations();
  const { updateCustomerInfo, isCustomerLoggedIn, customerInfo } = useLayoutContext();
  const { toast } = useToast();
  const { startTiming, endTiming } = usePerformanceMonitor('CheckInForm');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    phone: customerInfo.phone || '',
    shopName: customerInfo.shopName || '',
    event: customerInfo.event || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Optimized form handlers
  const handlePhoneChange = useCallback((phone: string) => {
    setFormData(prev => ({ ...prev, phone }));
  }, []);

  const handleShopNameChange = useCallback((shopName: string) => {
    setFormData(prev => ({ ...prev, shopName }));
  }, []);

  const handleEventChange = useCallback((event: string) => {
    setFormData(prev => ({ ...prev, event }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    startTiming();
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate form with toast notifications instead of inline errors
      const formErrors = validateForm(formData, t);
      
      if (Object.keys(formErrors).length > 0) {
        // Show first validation error as toast popup
        const firstError = Object.values(formErrors)[0];
        toast({
          variant: 'destructive',
          title: t('validation.errorTitle', { default: 'Validation Error' }),
          description: firstError,
        });
        setIsSubmitting(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update customer info
      updateCustomerInfo({
        ...formData,
        registeredAt: new Date(),
      });

      toast({
        title: t('success.checkIn', { default: 'Check-in successful!' }),
        description: t('success.welcome', { default: `Welcome ${formData.shopName} to the event!` }),
        variant: 'success',
      });

      endTiming('form submission');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setSubmitError(errorMessage);
      
      toast({
        title: t('error.checkIn', { default: 'Check-in failed' }),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, t, updateCustomerInfo, toast, startTiming, endTiming]);

  const handleRetry = useCallback(() => {
    setSubmitError(null);
  }, []);

  // If already checked in, show success state
  if (isCustomerLoggedIn) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">
            {t('success.alreadyCheckedIn', { default: 'Already Checked In' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>{t('customer.shopName')}:</strong> {customerInfo.shopName}</p>
            <p><strong>{t('customer.phone')}:</strong> {customerInfo.phone}</p>
            <p><strong>{t('customer.event')}:</strong> {customerInfo.event}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => updateCustomerInfo({ phone: '', shopName: '', event: '' })}
          >
            {t('actions.checkInDifferent', { default: 'Check in with different details' })}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {t('checkin.title', { default: 'Event Check-In' })}
        </CardTitle>
        <p className="text-muted-foreground">
          {t('checkin.description', { default: 'Please enter your details to participate' })}
        </p>
      </CardHeader>
      
      <CardContent>
        {submitError && (
          <div className="mb-6">
            <ErrorDisplay 
              error={submitError}
              onRetry={handleRetry}
              title={t('error.submission', { default: 'Submission Error' })}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PhoneInput
            value={formData.phone}
            onChange={handlePhoneChange}
            disabled={isSubmitting}
            t={t}
          />

          <ShopNameInput
            value={formData.shopName}
            onChange={handleShopNameChange}
            disabled={isSubmitting}
            t={t}
          />

          <EventSelect
            value={formData.event}
            onChange={handleEventChange}
            disabled={isSubmitting}
            t={t}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" text={t('common.loading')} />
            ) : (
              t('actions.checkIn', { default: 'Check In' })
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});

CheckInForm.displayName = 'CheckInForm';
