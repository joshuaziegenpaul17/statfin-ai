'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import CurrencySelector from './CurrencySelector';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/assessment', label: 'Assessment' },
    { href: '/historical', label: 'Analysis' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1520px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo wordmark */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-serif text-xl tracking-[0.05em] uppercase hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 7,24 C 9.5,8.5 14.5,8.5 17.5,16 C 20.5,23.5 22.5,23.5 25,8"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="24" r="2.5" fill="#FFFFFF" />
              <circle cx="13" cy="10" r="2.5" fill="#FFFFFF" />
              <circle cx="19" cy="22" r="2.5" fill="#FFFFFF" />
              <circle cx="25" cy="8" r="2.5" fill="#FFFFFF" />
            </svg>
            <span>StatFin AI</span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-[13px] uppercase tracking-[0.08em] transition-all duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-muted hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <CurrencySelector />

          {/* Desktop Start Button */}
          <Link
            href="/assessment"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black hover:bg-neutral-200 transition-colors"
          >
            Start Assessment →
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="md:hidden p-2 text-white hover:text-neutral-400 focus:outline-none transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Polish Mobile Full-screen Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col p-6 animate-fade-in md:hidden">
          {/* Close Header */}
          <div className="flex justify-between items-center h-16 border-b border-border-subtle mb-10">
            <span className="font-serif text-lg tracking-wider uppercase text-white">StatFin AI</span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 text-white hover:text-neutral-400 focus:outline-none transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Vertical Menu Items */}
          <nav className="flex flex-col gap-6 text-left pl-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-serif text-3xl tracking-wide transition-all duration-200 ${
                    isActive ? 'text-white italic' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Prominent CTA Start Button at the Bottom */}
          <div className="mt-auto pb-8 px-4">
            <Link
              href="/assessment"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center rounded-full bg-white py-4 text-[15px] font-semibold text-black hover:bg-neutral-200 transition-all active:scale-95 duration-200"
            >
              Start Assessment →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
