import React from 'react'
import { Logo } from '../atoms/logo/Logo'
import styles from './Layout.module.scss'
import { useTranslations } from 'next-intl'
import LocalSwitcher from '../atoms/localSwitcher/LocalSwitcher'
import Navbar from '../molecules/navbar/Navbar'

export const Header = () => {
    const t = useTranslations()
    return (
        <header className={styles.header}>
            <Logo />
            <Navbar
                cat1={t('Navbar.projects')}
                cat2={t('Navbar.directors')}
                cat3={t('Navbar.contact')}
            />
            <LocalSwitcher
                enOption={t('Global.language.en')}
                frOption={t('Global.language.fr')}
            />
        </header>
    )
}
