import React from 'react'
import { Logo } from '../atoms/logo/Logo'
import Link from 'next/link'
import styles from './Layout.module.css'
import { useTranslations } from 'next-intl'
import LocalSwitcher from '../atoms/localSwitcher/LocalSwitcher'

export const Header = () => {
  const t = useTranslations()
  return (
    <header className={styles.header}>
        <Logo />
        <nav>
            <ul>
                <li><Link href="/director">{t('Navbar.director')}</Link></li>
                <li><Link href="/photographer">{t('Navbar.photographer')}</Link></li>
                <li><Link href="/contact">{t('Navbar.contact')}</Link></li>
            </ul>
        </nav>
            <LocalSwitcher enOption={t('Global.language.en')} frOption={t('Global.language.fr')}/>
    </header>
  )
}
