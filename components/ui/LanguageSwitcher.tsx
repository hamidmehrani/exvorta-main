'use client';

import { usePathname, useRouter, routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';

const localeNames: Record<string, string> = {
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  if (routing.locales.length <= 1) {
    return null;
  }

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <select
      value={locale}
      onChange={handleLocaleChange}
      className="bg-transparent border border-border text-text text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
      aria-label="Select language"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc] || loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
