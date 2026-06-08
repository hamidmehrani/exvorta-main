'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

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
      <option value="en">English</option>
      <option value="ar">العربية</option>
      <option value="fa">فارسی</option>
    </select>
  );
}
