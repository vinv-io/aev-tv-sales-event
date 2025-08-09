'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathnameWithoutLocale = pathname.startsWith(`/${locale}`) 
      ? pathname.slice(`/${locale}`.length) 
      : pathname;
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="vi">VIE</SelectItem>
        <SelectItem value="en">ENG</SelectItem>
      </SelectContent>
    </Select>
  );
}
