'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  locale: string;
  name: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  SGD: { code: 'SGD', symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar' },
  AED: { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham' },
};

interface CurrencyContextType {
  selectedCurrency: string;
  setSelectedCurrency: (code: string) => void;
  formatCurrency: (value: number) => string;
  formatCurrencyRaw: (value: number) => string;
  replaceCurrencySymbols: (text: string) => string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCurrency, setSelectedCurrencyState] = useState<string>('INR');

  useEffect(() => {
    const saved = localStorage.getItem('statfin_currency');
    if (saved && CURRENCIES[saved]) {
      setSelectedCurrencyState(saved);
    }
  }, []);

  const setSelectedCurrency = (code: string) => {
    if (CURRENCIES[code]) {
      setSelectedCurrencyState(code);
      localStorage.setItem('statfin_currency', code);
    }
  };

  const currencyInfo = CURRENCIES[selectedCurrency];
  const currencySymbol = currencyInfo.symbol;

  // Format currency with standard fraction formatting
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format currency without decimals, custom formatted
  const formatCurrencyRaw = (value: number): string => {
    const formatter = new Intl.NumberFormat(currencyInfo.locale, {
      maximumFractionDigits: 0,
    });
    return `${currencySymbol}${formatter.format(value)}`;
  };

  // Replace ₹ symbols with the active currency symbol in agent text blocks
  const replaceCurrencySymbols = (text: string): string => {
    if (!text) return '';
    // Replace rupee symbol
    return text.replace(/₹/g, currencySymbol);
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        formatCurrency,
        formatCurrencyRaw,
        replaceCurrencySymbols,
        currencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
