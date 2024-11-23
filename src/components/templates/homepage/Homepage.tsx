'use client'
import useMobile from '@/hooks/useMobile'
// import { useTranslations } from 'next-intl'
import React from 'react'
import styles from './Homepage.module.scss'

export default function Homepage() {
    // const t = useTranslations()
    const isMobile = useMobile()
    console.log('isMobile', isMobile)

    return (
        <main className={styles.homepage}>
            <section className={styles.textContainer}>
                <p className={styles.directorName}>toto</p>
                <p>&quot;projet nommé tata par toto&quot;</p>
            </section>

            <section className={styles.videoContainer}>
                <video
                    className={styles.backgroundVideo}
                    // src={currentVideo ?? null}
                    src="/OtacosLea.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </section>
        </main>
    )
}
