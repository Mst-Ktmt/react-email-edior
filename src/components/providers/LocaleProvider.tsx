'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Locale } from '@/i18n';

// メッセージをスタティックにimport
import jaMessages from '../../../messages/ja.json';
import enMessages from '../../../messages/en.json';

type Messages = typeof jaMessages;

const messages: Record<Locale, Messages> = {
  ja: jaMessages,
  en: enMessages,
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (namespace: string, key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

const LOCALE_STORAGE_KEY = 'email-editor-locale';

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

export function useTranslations(namespace: keyof Messages) {
  const { locale } = useLocale();
  const namespaceMessages = messages[locale][namespace] as Record<string, string>;

  return useCallback((key: string): string => {
    return namespaceMessages[key] || key;
  }, [namespaceMessages]);
}

interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
}

export function LocaleProvider({ children, defaultLocale = 'ja' }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isHydrated, setIsHydrated] = useState(false);

  // クライアントサイドでlocalStorageから復元
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && (stored === 'ja' || stored === 'en')) {
      setLocaleState(stored);
    }
    setIsHydrated(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    // html lang属性も更新
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback((namespace: string, key: string): string => {
    const currentMessages = messages[locale];
    const namespaceMessages = currentMessages[namespace as keyof Messages] as Record<string, string> | undefined;
    return namespaceMessages?.[key] || key;
  }, [locale]);

  const contextValue = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  // ハイドレーション前でもchildrenをレンダリング（デフォルトlocaleで）
  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}
