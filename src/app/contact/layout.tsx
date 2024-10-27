/* eslint-disable @typescript-eslint/no-explicit-any */
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layouts/Header";

interface ContactLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function ContactLayout({
  children,
  params,
}: Awaited<ContactLayoutProps>) {
  const { locale } = params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  return (
    <html lang={locale}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
