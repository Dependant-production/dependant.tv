import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server";

export default function Home({params: {locale}}: LocaleParams) {
  const t = useTranslations('Homepage')
  setRequestLocale(locale);

  return (
    <h1>{t('title')}</h1>
  ) 
  }
