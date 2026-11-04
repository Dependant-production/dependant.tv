'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from '@/i18n/routing'
import styles from './ProjectSections.module.scss'

const SECTIONS = [
    { href: '/projects/commercials', label: 'commercials' },
    { href: '/projects/music-videos', label: 'musicVideos' },
    { href: '/projects/photography', label: 'stills' },
] as const

export default function ProjectSections() {
    const t = useTranslations('Projects')
    const containerRef = useRef<HTMLElement | null>(null)

    useGSAP(
        () => {
            const words = containerRef.current?.querySelectorAll(
                `.${styles.word}`
            )
            if (!words?.length) return

            gsap.to(words, {
                width: 'auto',
                delay: 0.3,
                duration: 1,
                ease: 'power3.inOut',
            })
        },
        { scope: containerRef }
    )

    return (
        <main className={styles.sections} ref={containerRef}>
            {SECTIONS.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    aria-label={t(label)}
                    className={styles.link}
                >
                    [<span className={styles.word}>{t(label)}</span>]
                </Link>
            ))}
        </main>
    )
}
