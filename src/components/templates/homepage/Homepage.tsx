/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import styles from './Homepage.module.scss'

export default function Homepage({ homepageData }: any) {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null)
    const [currentTitle, setCurrentTitle] = useState('')
    const [currentDirector, setCurrentDirector] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (!homepageData || homepageData.length === 0) return

        const video = homepageData[currentIndex]
        const videoUrl = video?.url[0]?.url
        setCurrentVideo(
            (process.env.NEXT_PUBLIC_STRAPI_BASE_URL + videoUrl) as string
        )
        setCurrentTitle(video?.title || '')
        setCurrentDirector(video?.director?.name || '')
        // Changer de vidéo toutes les 5 secondes
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % homepageData.length
            setCurrentIndex(nextIndex)
        }, 5000)

        // Nettoyer l'intervalle au démontage
        return () => clearInterval(interval)
    }, [currentIndex, homepageData])

    return (
        <main className={styles.homepage}>
            <section className={styles.textContainer}>
                <p className={styles.directorName}>{currentDirector}</p>
                <p>&quot;{currentTitle}&quot;</p>
            </section>

            <section className={styles.videoContainer}>
                <video
                    className={styles.backgroundVideo}
                    src={currentVideo as string}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </section>
        </main>
    )
}
