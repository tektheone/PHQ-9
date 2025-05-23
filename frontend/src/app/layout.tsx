import { Inter } from 'next/font/google';
import './globals.css';
import { Outfit } from 'next/font/google';
import { Providers } from '@/app/providers';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Clinical Assessment | Blueprint',
  description: 'A comprehensive clinical assessment tool for mental health screening',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
