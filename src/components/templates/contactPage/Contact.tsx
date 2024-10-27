import { Button } from '@/components/atoms/button/Button'
import Infos from '@/components/molecules/infos/Infos'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function Contact() {
    const t = useTranslations()
  return (
    <main>
    <h1>{t('Navbar.contact')}</h1>
    <Button />
    <Infos />
  </main>
  )
}
