import { useTranslations } from 'next-intl'
import React from 'react'

export default function Photographer() {

    const t = useTranslations()
  return (
    <main>
        <h1>{t('Navbar.photographer')}</h1>
    </main>
  )
}
