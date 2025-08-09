
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { ClientWrapper } from './client-wrapper';

const locales = ['en', 'vi'];

interface Props {
  children: ReactNode;
  params: {locale: string};
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const {locale} = params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();
  
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ClientWrapper>
        {children}
      </ClientWrapper>
    </NextIntlClientProvider>
  );
}
