'use client'
import React from 'react'
import { Logo } from '../atoms/logo/Logo'
import styles from './Layout.module.scss'
import { useTranslations } from 'next-intl'
import LocalSwitcher from '../atoms/localSwitcher/LocalSwitcher'
import Navbar from '../molecules/navbar/Navbar'
import { usePathname } from '@/i18n/routing'

export const Header = () => {
    const t = useTranslations()
    const pathname = usePathname()

    const blackRoutes = ['/photographers', '/contact']
    const isBlack = blackRoutes.some((route) => pathname.startsWith(route))
    const color = isBlack ? 'black' : 'white'
    
    return (
        <header className={styles.header}>
            <Logo isBlack={isBlack} />
            <Navbar
                cat1={t('Navbar.directors')}
                cat2={t('Navbar.photographers')}
                cat3={t('Navbar.contact')}
                color={color}
            />
            <LocalSwitcher
                enOption={t('Global.language.en')}
                frOption={t('Global.language.fr')}
            />
        </header>
    )
}
