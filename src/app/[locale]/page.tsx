import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations('Homepage')

  return (
    <h1>{t('title')}</h1>
  ) 
  }
