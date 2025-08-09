import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !['en', 'vi'].includes(locale)) {
    notFound();
  }

  try {
    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error('Error loading messages for locale:', locale, error);
    notFound();
  }
});
