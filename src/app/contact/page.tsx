import { Button } from "@/components/atoms/button/Button";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage({ params: { locale } }: LocaleParams) {
  const t = useTranslations("Homepage");

  setRequestLocale(locale);
  console.log("t", t);
  return (
    <html lang={locale}>
      <body>
        <h1>Hello, Contact Page!</h1>
        <Button />
      </body>
    </html>
  );
}
