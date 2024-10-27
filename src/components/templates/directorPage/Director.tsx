import { useTranslations } from 'next-intl'
import React from 'react'

export default function Director() {

    const t = useTranslations()
  return (
    <main>
        <h1>{t('Navbar.director')}</h1>
    </main>
  )
}
