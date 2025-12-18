import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { I18nProvider } from "@/lib/i18n";
import { CompareBar } from "@/components/catalog/CompareBar";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "УзАгро | Сельхозтехника для Узбекистана",
    template: "%s | УзАгро",
  },
  description:
    "Тракторы, комбайны и запчасти от ведущих производителей мира. Доставка по всему Узбекистану.",
  keywords: [
    "сельхозтехника",
    "тракторы",
    "комбайны",
    "запчасти",
    "Узбекистан",
    "YTO",
    "Rostselmash",
  ],
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "УзАгро | Сельхозтехника для Узбекистана",
    description: "Тракторы, комбайны и запчасти от ведущих производителей мира.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <I18nProvider>
          <Header />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <CompareBar />
          <Toaster richColors position="top-right" />
        </I18nProvider>
      </body>
    </html>
  );
}

