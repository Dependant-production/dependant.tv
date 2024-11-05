import { useTranslations } from 'next-intl'
import React from 'react'

export default function Photographers() {
    const t = useTranslations()
    return (
        <main>
            <h1>{t('Navbar.photographers')}</h1>
        </main>
    )
}
