/**
 * i18n configuration for next-intl
 */

export const locales = ['ru', 'uz', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export function getMessages(locale: Locale) {
    return import(`./messages/${locale}.json`);
}
