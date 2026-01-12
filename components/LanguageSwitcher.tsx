'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter, usePathname} from 'next/navigation';
import {useState} from 'react';
import {ChevronDown, Globe} from 'lucide-react';

const locales = [
  {code: 'en', name: 'English', flag: '🇬🇧'},
  {code: 'it', name: 'Italiano', flag: '🇮🇹'},
  {code: 'ru', name: 'Русский', flag: '🇷🇺'},
  {code: 'fr', name: 'Français', flag: '🇫🇷'}
];

export default function LanguageSwitcher() {
  const t = useTranslations('languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
        aria-label={t('switchLanguage')}
      >
        <Globe className="w-5 h-5 text-foreground" />
        <span className="hidden sm:inline text-sm font-medium">
          {currentLocale.flag} {currentLocale.name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => switchLocale(loc.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                  locale === loc.code ? 'bg-muted/50 font-medium' : ''
                }`}
              >
                <span className="text-xl">{loc.flag}</span>
                <span className="text-sm">{loc.name}</span>
                {locale === loc.code && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
