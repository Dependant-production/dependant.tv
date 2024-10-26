/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layouts/Header";


const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dependant.tv",
};

interface HomeLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function HomeLayout({
  children,
  params: {locale}
}: Readonly<HomeLayoutProps>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  setRequestLocale(locale);
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
