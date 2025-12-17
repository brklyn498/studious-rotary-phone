'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n, Locale } from '@/lib/i18n';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
    variant?: 'dropdown' | 'inline' | 'minimal';
    showFlag?: boolean;
    showName?: boolean;
    className?: string;
}

const FlagIcon = ({ locale, className }: { locale: Locale; className?: string }) => {
    // 3:2 aspect ratio mostly
    const commonProps = {
        className: cn("w-5 h-auto object-cover rounded-[2px] shadow-sm", className),
        viewBox: "0 0 900 600", // Standardized to 3:2
        xmlns: "http://www.w3.org/2000/svg"
    };

    if (locale === 'ru') {
        return (
            <svg {...commonProps}>
                <rect width="900" height="600" fill="#fff" />
                <rect y="200" width="900" height="200" fill="#0039a6" />
                <rect y="400" width="900" height="200" fill="#d52b1e" />
            </svg>
        );
    }

    if (locale === 'uz') {
        return (
            <svg {...commonProps}>
                <rect width="900" height="600" fill="#1eb53a" />
                <rect width="900" height="200" fill="#0099b5" />
                <rect y="200" width="900" height="200" fill="#fff" />
                <rect y="395" width="900" height="5" fill="#ce1126" />
                <rect y="200" width="900" height="5" fill="#ce1126" />
                <circle cx="130" cy="100" r="60" fill="#fff" />
                <circle cx="150" cy="100" r="52" fill="#0099b5" />
                {/* Simplified stars representation */}
                <g fill="#fff" transform="translate(260, 60) scale(0.6)">
                    <circle cx="0" cy="0" r="15" />
                    <circle cx="50" cy="0" r="15" />
                    <circle cx="100" cy="0" r="15" />
                    <circle cx="50" cy="50" r="15" />
                    <circle cx="100" cy="50" r="15" />
                </g>
            </svg>
        );
    }

    if (locale === 'en') {
        return (
            <svg {...commonProps}>
                <clipPath id="uk-clip"><rect width="900" height="600" /></clipPath>
                <g clipPath="url(#uk-clip)">
                    <rect width="900" height="600" fill="#012169" />
                    <path d="M0,0 L900,600 M900,0 L0,600" stroke="#fff" strokeWidth="60" />
                    <path d="M0,0 L900,600 M900,0 L0,600" stroke="#c8102e" strokeWidth="20" />
                    <path d="M450,0 V600 M0,300 H900" stroke="#fff" strokeWidth="100" />
                    <path d="M450,0 V600 M0,300 H900" stroke="#c8102e" strokeWidth="60" />
                </g>
            </svg>
        );
    }

    return null;
};

export function LanguageSwitcher({
    variant = 'dropdown',
    showFlag = true,
    showName = true,
    className
}: LanguageSwitcherProps) {
    const { locale, setLocale, locales, getLocaleName } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (newLocale: Locale) => {
        setLocale(newLocale);
        setIsOpen(false);
    };

    if (variant === 'inline') {
        return (
            <div className={cn("flex items-center gap-1.5", className)}>
                {locales.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setLocale(loc)}
                        className={cn(
                            "px-3 py-1.5 text-sm rounded-lg transition-all duration-200 font-medium border border-transparent flex items-center gap-2",
                            locale === loc
                                ? "bg-white text-green-700 shadow-sm border-gray-100"
                                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                        )}
                    >
                        {showFlag && <FlagIcon locale={loc} className="w-4" />}
                        {loc.toUpperCase()}
                    </button>
                ))}
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <button
                onClick={() => {
                    const currentIndex = locales.indexOf(locale);
                    const nextIndex = (currentIndex + 1) % locales.length;
                    setLocale(locales[nextIndex]);
                }}
                className={cn(
                    "flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded transition-colors",
                    className
                )}
                aria-label="Switch language"
            >
                {showFlag && <FlagIcon locale={locale} className="w-4" />}
                <span className="font-semibold text-sm">{locale.toUpperCase()}</span>
            </button>
        );
    }

    // Default: dropdown
    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 border",
                    isOpen
                        ? "bg-white border-green-200 text-green-700 shadow-sm ring-2 ring-green-100"
                        : "bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-sm"
                )}
            >
                {showFlag ? (
                    <FlagIcon locale={locale} className="w-5" />
                ) : (
                    <Globe className="h-4 w-4 text-gray-500" />
                )}

                {showName ? (
                    <span>{getLocaleName(locale)}</span>
                ) : (
                    <span>{locale.toUpperCase()}</span>
                )}

                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-gray-400 transition-transform duration-200 ease-in-out",
                        isOpen && "rotate-180 text-green-600"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={cn(
                    "absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 origin-top-right p-1",
                    isOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                )}
            >
                {locales.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => handleSelect(loc)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors group",
                            locale === loc
                                ? "bg-green-50/80 text-green-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <span className="flex items-center gap-3">
                            {showFlag && <FlagIcon locale={loc} />}
                            <span>{getLocaleName(loc)}</span>
                        </span>
                        {locale === loc && <Check className="h-4 w-4 text-green-600" />}
                    </button>
                ))}
            </div>
        </div>
    );
}
