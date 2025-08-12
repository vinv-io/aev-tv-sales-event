import type {Metadata} from 'next';
import '../styles/globals.css';
import Providers from '@/components/providers/Providers';

// Force dynamic rendering for the entire application
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AQUA VN',
  description: 'Khơi nguồn cảm hứng sống',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
