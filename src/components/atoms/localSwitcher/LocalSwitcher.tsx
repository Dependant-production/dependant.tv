"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useTransition } from "react";

export default function LocalSwitcher({
  enOption,
  frOption,
}: {
  enOption: string;
  frOption: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentLocale = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
  };
  return (
    <label>
      <select
        defaultValue={currentLocale}
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="en">{enOption}</option>
        <option value="fr">{frOption}</option>
      </select>
    </label>
  );
}
