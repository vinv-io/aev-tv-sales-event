import type {Metadata} from 'next';
import '../styles/globals.css';
import Providers from '@/components/providers/Providers';

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
