'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/assessment', label: 'Assessment' },
    { href: '/historical', label: 'Analysis' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/about', label: 'About' },
  ];

  return (
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
  );
}
