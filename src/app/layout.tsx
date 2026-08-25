import type { Metadata } from 'next';
import { Newsreader, Manrope } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { CurrencyProvider } from '@/lib/context/CurrencyContext';
import Starfield from '@/components/Starfield';
import Header from '@/components/Header';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  weight: ['300', '400'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StatFin AI — Statistical Financial Intelligence',
  description:
    'StatFin AI is a personal financial risk assessment tool combining statistical analysis with intelligent financial insights.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${manrope.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-white selection:text-black">
        <CurrencyProvider>
          {/* Background Animated Starfield */}
          <Starfield />

          {/* Global Header Navigation */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 flex flex-col relative z-10">{children}</main>

          {/* Global Footer */}
          <footer className="w-full border-t border-border-subtle bg-black py-12 text-muted font-sans text-xs relative z-10">
            <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-serif text-white text-sm tracking-wider uppercase mb-1">StatFin AI</p>
                  <p className="text-[12px] text-neutral-400">Statistical Intelligence for Smarter Financial Decisions.</p>
                </div>
                <nav className="flex items-center gap-6 text-[12px]">
                  <Link href="/about" className="hover:text-white transition-colors">Privacy</Link>
                  <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
                  <Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link>
                </nav>
              </div>
              
              <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row justify-between gap-4 text-[11px] text-neutral-500">
                <p>
                  Educational analysis only. Not professional financial advice. Read full{' '}
                  <Link href="/disclaimer" className="text-neutral-400 hover:text-white underline">
                    Disclaimer
                  </Link>
                  .
                </p>
                <p>
                  Built by Joshua Ziegen Paul | GitHub:{' '}
                  <a
                    href="https://github.com/joshuaziegenpaul17"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline transition-all duration-200 hover:opacity-80 cursor-pointer font-medium"
                  >
                    https://github.com/joshuaziegenpaul17
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </CurrencyProvider>
      </body>
    </html>
  );
}
