'use client';

import { useLocale, useTranslations } from '@/components/providers/LocaleProvider';
import type { Locale } from '@/i18n';

const locales: Locale[] = ['ja', 'en'];

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations('LocaleSwitcher');

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {t(loc)}
        </option>
      ))}
    </select>
  );
}
