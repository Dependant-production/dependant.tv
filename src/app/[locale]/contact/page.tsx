import { Button } from "@/components/atoms/button/Button";
import Infos from "@/components/molecules/infos/Infos";
import { Metadata } from "next";
// import {  useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  // const t = useTranslations("Homepage");

  return (
    <>
      <h1>Hello, Contact Page!</h1>
      <Infos />
      <Button />
    </>
  );
}
