import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';

export const metadata: Metadata = {
  title: 'Mount Print Zone (MPZ) - Precision Commercial Printing & Packaging',
  description:
    'High precision offset, digital & outdoor flex printing shop. Order custom business cards, banners, stickers, mugs, and apparel online with live order tracking.',
  keywords: [
    'Mount Print Zone',
    'MPZ',
    'Commercial Printing',
    'Business Cards',
    'Flex Banners',
    'Custom Stickers',
    'Book Binding',
    'Mug Printing',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-sky-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
