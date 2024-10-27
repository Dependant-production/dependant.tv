import { Metadata } from "next";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Director",
};

export default function DirectorPage() {
  const t = useTranslations("Homepage");

  console.log("t", t);

  console.log("t", t);
  return <h1>Hello, Director Page!</h1>;
}
