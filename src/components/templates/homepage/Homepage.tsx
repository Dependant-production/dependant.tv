"use client";
import useMobile from "@/hooks/useMobile";
import { useTranslations } from "next-intl";
import React from "react";

export default function Homepage() {
  const t = useTranslations();
  const isMobile = useMobile();
  console.log("isMobile", isMobile);
  return (
    <main>
      <h1>{t("Homepage.title")}</h1>
      <h3>{t("Homepage.desc")}</h3>
      {isMobile && (
        <h4>OUAZDAUIEFIUAERFHUHUEARYZFBHUZEBGFRDUFHUERYZBGHUEIRIZVIUZSH</h4>
      )}
    </main>
  );
}
