import React from 'react'
import { Logo } from '../atoms/logo/Logo'
import Link from 'next/link'
import styles from './Layout.module.css'
import { useTranslations } from 'next-intl'

export const Header = () => {
  const t = useTranslations('Navbar')
  return (
    <header className={styles.header}>
        <Logo />
        <nav>
            <ul>
                <li><Link href="/director">{t('director')}</Link></li>
                <li><Link href="/photographer">{t('photographer')}</Link></li>
                <li><Link href="/contact">{t('contact')}</Link></li>
            </ul>
            <button></button>
        </nav>
    </header>
  )
}
