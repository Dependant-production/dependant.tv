import { useTranslations } from "next-intl";
import React from "react";

export default function Projects() {
  const t = useTranslations();
  return (
    <main>
      <h1>{t("Navbar.projects")}</h1>
    </main>
  );
}
