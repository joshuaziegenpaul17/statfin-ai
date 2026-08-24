import type { Metadata } from 'next';
import { Newsreader, Manrope } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { CurrencyProvider } from '@/lib/context/CurrencyContext';
import CurrencySelector from '@/components/CurrencySelector';
import Starfield from '@/components/Starfield';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  weight: ['300', '400'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['200', '300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'StatFin AI — Statistical Financial Intelligence',
  description:
    'A personal financial risk assessment system combining deterministic statistical analysis with an agentic reasoning layer.',
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

          {/* Simplified Global Navigation */}
          <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1520px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-12">
                {/* Logo acts as Home Navigator */}
                <Link
                  href="/"
                  className="font-serif text-xl tracking-[0.05em] uppercase hover:opacity-80 transition-opacity"
                >
                  StatFin AI
                </Link>
                
                <nav className="hidden md:flex items-center gap-8">
                  <Link
                    href="/assessment"
                    className="font-sans text-[13px] uppercase tracking-[0.08em] text-muted hover:text-white transition-colors"
                  >
                    Assessment
                  </Link>
                  <Link
                    href="/historical"
                    className="font-sans text-[13px] uppercase tracking-[0.08em] text-muted hover:text-white transition-colors"
                  >
                    Analysis
                  </Link>
                  <Link
                    href="/methodology"
                    className="font-sans text-[13px] uppercase tracking-[0.08em] text-muted hover:text-white transition-colors"
                  >
                    Methodology
                  </Link>
                  <Link
                    href="/about"
                    className="font-sans text-[13px] uppercase tracking-[0.08em] text-muted hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-6">
                {/* Currency Selection Dropdown */}
                <CurrencySelector />

                <Link
                  href="/assessment"
                  className="hidden sm:inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black hover:bg-neutral-200 transition-colors"
                >
                  Start Assessment →
                </Link>
                
                {/* Mobile Menu Actions */}
                <div className="md:hidden flex items-center gap-3">
                  <Link
                    href="/assessment"
                    className="text-xs uppercase tracking-[0.08em] px-2.5 py-1.5 border border-border-subtle rounded-full text-white hover:bg-hover-surface"
                  >
                    Start
                  </Link>
                  <Link
                    href="/historical"
                    className="text-xs uppercase tracking-[0.08em] text-muted hover:text-white"
                  >
                    Upload
                  </Link>
                </div>
              </div>
            </div>
          </header>

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
                  <Link href="/about" className="hover:text-white transition-colors">Disclaimer</Link>
                  <Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link>
                </nav>
              </div>
              
              <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row justify-between gap-4 text-[11px] text-neutral-500">
                <p>
                  Educational analysis only. Not professional financial advice. Read full{' '}
                  <Link href="/about" className="text-neutral-400 hover:text-white underline">
                    Disclaimer
                  </Link>
                  .
                </p>
                <p>
                  Built by{' '}
                  <a
                    href="https://github.com/joshuaziegenpaul17"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline transition-all duration-200 hover:opacity-80 cursor-pointer font-medium"
                  >
                    Joshua Ziegen Paul
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
