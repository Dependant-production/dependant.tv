import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Photographer",
};

export default function PhotograperPage() {
  const t = useTranslations("Homepage");
  console.log('t', t)

  return <h1>Hello, Photographer Page!</h1>;
}
