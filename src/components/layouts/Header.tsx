'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { Logo } from '../atoms/logo/Logo'
import styles from './Layout.module.scss'
import { useGSAP } from '@gsap/react'
import { useTranslations } from 'next-intl'
import LocalSwitcher from '../atoms/localSwitcher/LocalSwitcher'
import Navbar from '../molecules/navbar/Navbar'
import { usePathname } from '@/i18n/routing'
import useMobile from '@/hooks/useMobile'

export const Header = () => {
    const t = useTranslations()
    const pathname = usePathname()
    const isMobile = useMobile()

    const headerRef = useRef<HTMLDivElement | null>(null)

    const blackRoutes = ['/photographers', '/contact']
    const isBlack = blackRoutes.some((route) => pathname.startsWith(route))
    const isPhotographers = pathname.startsWith('/photographers')
    const color =
        isBlack && isMobile && isPhotographers
            ? 'white'
            : isBlack
            ? 'black'
            : 'white'

    useGSAP(() => {
        const elements = headerRef.current?.querySelectorAll(
            `.${styles.headerItem}`
        )

        console.log('elements', elements)
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
                <div className={`${styles.headerItem}`}>
                    <Navbar
                        cat1={t('Navbar.directors')}
                        cat2={t('Navbar.photographers')}
                        cat3={t('Navbar.contact')}
                        color={color}
                    />
                </div>
            </div>
            <div className={`${styles.headerItem}`}>
                <LocalSwitcher />
            </div>
        </header>
    )
}
