'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from '@/i18n/routing'
import styles from './ProjectSections.module.scss'

export default function ProjectSections() {
    const t = useTranslations('Projects')
    const containerRef = useRef<HTMLElement | null>(null)

    useGSAP(
        () => {
            const links = containerRef.current?.querySelectorAll('a')
            if (!links?.length) return

            gsap.fromTo(
                links,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                }
            )
        },
        { scope: containerRef }
    )

    return (
        <main className={styles.sections} ref={containerRef}>
            <Link href="/projects/commercials" className={styles.link}>
                {t('commercials')}
            </Link>
            <Link href="/projects/music-videos" className={styles.link}>
                {t('musicVideos')}
            </Link>
            <Link href="/projects/photography" className={styles.link}>
                {t('photography')}
            </Link>
        </main>
    )
}
