'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/routing'
import { useGSAP } from '@gsap/react'
import useMobile from '@/hooks/useMobile'
import { Logo } from '../atoms/logo/Logo'
import LocalSwitcher from '../atoms/localSwitcher/LocalSwitcher'
import Navbar from '../molecules/navbar/Navbar'
import styles from './Layout.module.scss'

export const Header = () => {
    const t = useTranslations()
    const pathname = usePathname()
    const isMobile = useMobile()

    const headerRef = useRef<HTMLDivElement | null>(null)

    const isContactPage = pathname.startsWith('/contact')
    const isPhotographersPage = pathname.startsWith('/photographers/')

    let color: 'white' | 'black' = 'white'

    if (isContactPage) {
        color = 'black'
    } else if (isPhotographersPage) {
        color = isMobile ? 'white' : 'black'
    }

    useGSAP(() => {
        const elements = headerRef.current?.querySelectorAll(
            `.${styles.headerItem}`
        )

        if (elements) {
            gsap.fromTo(
                elements,
                { y: -50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.2,
                    ease: 'back.out(1.7)',
                }
            )
        }
    }, [isMobile])

    return isMobile ? (
        <header className={styles.headerMobile} ref={headerRef}>
            <div className={styles.headerMobileContainer}>
                <Logo isBlack={color} />
                <LocalSwitcher />
            </div>
            <Navbar
                cat1={t('Navbar.directors')}
                cat2={t('Navbar.photographers')}
                cat3={t('Navbar.contact')}
                color={color}
            />
        </header>
    ) : (
        <header className={styles.header} ref={headerRef}>
            <div className={`${styles.headerItem}`}>
                <Logo isBlack={color} />
            </div>
            <div className={`${styles.headerItem}`}>
                <Navbar
                    cat1={t('Navbar.directors')}
                    cat2={t('Navbar.photographers')}
                    cat3={t('Navbar.contact')}
                    color={color}
                />
            </div>
            <div className={`${styles.headerItem}`}>
                <LocalSwitcher />
            </div>
        </header>
    )
}
