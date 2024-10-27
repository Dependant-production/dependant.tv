import { Button } from "@/components/atoms/button/Button";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const t = useTranslations("Homepage");

  console.log("t", t);
  return (
    <>
      <h1>Hello, Contact Page!</h1>
      <Button />
    </>
  );
}
