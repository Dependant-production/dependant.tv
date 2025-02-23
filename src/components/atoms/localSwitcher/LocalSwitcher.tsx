'use client'
import React, { useRef, useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { routing } from '../../../i18n/routing'
import { usePathname, useRouter } from '@/i18n/routing'
import styles from './LocalSwitcher.module.scss'
import useMobile from '@/hooks/useMobile'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function LocalSwitcher() {
    const router = useRouter()
    const isMobile = useMobile()
    const currentLocale = useLocale()
    const pathname = usePathname()

    const containerRef = useRef<HTMLDivElement | null>(null)

    const [isHover, setIsHover] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isPending, startTransition] = useTransition()

    const locales = routing.locales.filter((locale) => locale !== currentLocale)

    const isContactPage = pathname.startsWith('/contact')
    const isPhotographersPage = pathname.startsWith('/photographers/')

    let color = styles.white

    if (isContactPage) {
        color = styles.black
    } else if (isPhotographersPage) {
        color = isMobile ? styles.white : styles.black
    }

    const handleLocaleChange = (locale: string) => {
        startTransition(() => {
            router.replace({ pathname }, { locale })
        })
    }

    const handleHoverOpen = () => {
        setIsHover(true)
    }

    const handleHoverClose = () => {
        setIsHover(false)
    }

    useGSAP(() => {
        const locs = containerRef.current?.querySelectorAll(`.${styles.locale}`)
        if (locs && isHover) {
            gsap.fromTo(
                locs,
                { y: -20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'ease',
                    stagger: 0.2,
                }
            )
        }
    }, [isHover])
    return (
        <div
            className={styles.localeButton}
            onMouseEnter={handleHoverOpen}
            onMouseLeave={handleHoverClose}
            ref={containerRef}
        >
            <span className={`${styles.currentLocale} ${color}`}>
                {currentLocale}
            </span>
            {isHover && (
                <ul className={styles.localeList}>
                    {locales.map((locale, index) => (
                        <li
                            key={index}
                            className={`${styles.locale} ${color}`}
                            onClick={() => handleLocaleChange(locale)}
                        >
                            {locale}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
