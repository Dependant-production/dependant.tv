import { useTranslations } from 'next-intl'
import React from 'react'

export default function NotFound() {
    const t = useTranslations('NotFound')

  return (
   <html>
    <body>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
    </body>
   </html>
  )
}
