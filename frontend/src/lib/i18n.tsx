'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import translations
import ru from '@/locales/ru.json';
import uz from '@/locales/uz.json';
import en from '@/locales/en.json';

export type Locale = 'ru' | 'uz' | 'en';

const translations = { ru, uz, en };

const localeNames: Record<Locale, string> = {
    ru: 'Русский',
    uz: "O'zbekcha",
    en: 'English',
};

const localeFlags: Record<Locale, string> = {
    ru: '🇷🇺',
    uz: '🇺🇿',
    en: '🇬🇧',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = Record<string, any>;

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    locales: Locale[];
    getLocaleName: (locale: Locale) => string;
    getLocaleFlag: (locale: Locale) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getNestedValue(obj: Translations, path: string): string {
    const keys = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = obj;

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return path; // Return key if translation not found
        }
    }

    return typeof value === 'string' ? value : path;
}

function interpolate(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        return params[key]?.toString() ?? `{${key}}`;
    });
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('ru');
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved locale from localStorage
    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale | null;
        if (savedLocale && translations[savedLocale]) {
            setLocaleState(savedLocale);
        }
        setIsInitialized(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
        // Update HTML lang attribute
        document.documentElement.lang = newLocale;
    };

    const t = (key: string, params?: Record<string, string | number>): string => {
        const translation = getNestedValue(translations[locale] as Translations, key);
        if (params) {
            return interpolate(translation, params);
        }
        return translation;
    };

    const getLocaleName = (loc: Locale) => localeNames[loc];
    const getLocaleFlag = (loc: Locale) => localeFlags[loc];

    // Prevent hydration mismatch by not rendering until initialized
    if (!isInitialized) {
        return null;
    }

    return (
        <I18nContext.Provider
            value={{
                locale,
                setLocale,
                t,
                locales: ['ru', 'uz', 'en'],
                getLocaleName,
                getLocaleFlag,
            }}
        >
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

// Hook for accessing just the translation function
export function useTranslation() {
    const { t, locale } = useI18n();
    return { t, locale };
}
