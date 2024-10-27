/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import BaseLayout from "@/components/templates/baseLayout/BaseLayout";
import "./globals.scss";
import { LayoutProps } from "../../../.next/types/app/layout";

export const metadata: Metadata = {
  title: "Dependant.tv",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomeLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
