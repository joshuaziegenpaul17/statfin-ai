'use client';

import React from 'react';
import { useCurrency, CURRENCIES } from '@/lib/context/CurrencyContext';

export default function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  return (
    <div className="relative inline-block">
      <select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        className="appearance-none bg-dark-surface border border-border-subtle hover:border-neutral-500 rounded-full px-4 py-1.5 pr-8 text-[12px] font-medium text-white cursor-pointer focus:ring-1 focus:ring-white transition-all-custom font-sans uppercase tracking-wider"
        aria-label="Select global currency format"
      >
        {Object.values(CURRENCIES).map((curr) => (
          <option key={curr.code} value={curr.code} className="bg-black text-white text-[12px]">
            {curr.symbol} {curr.code}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted">
        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
}
