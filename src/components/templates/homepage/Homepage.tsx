/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import styles from './Homepage.module.scss'
import { Link } from '@/i18n/routing'

export default function Homepage({ homepageData }: any) {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null)
    const [currentTitle, setCurrentTitle] = useState('')
    const [currentDirector, setCurrentDirector] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    console.log('homepageData', homepageData)

    useEffect(() => {
        if (!homepageData || homepageData.length === 0) return
        const video = homepageData[currentIndex]
        const videoUrl = video?.url[0]?.url
        setCurrentVideo(videoUrl as string)
        setCurrentTitle(video?.title || '')
        setCurrentDirector(video?.director?.name || '')
        // Changer de vidéo toutes les 5 secondes
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % homepageData.length
            setCurrentIndex(nextIndex)
        }, 10000)

        // Nettoyer l'intervalle au démontage
        return () => clearInterval(interval)
    }, [currentIndex, homepageData])

    const getLinkDirectors = () => {
        let link
        if (currentDirector) {
            link = `directors/${currentDirector.toLowerCase()}`
        }
        return link
    }

    return (
        <main className={styles.homepage}>
            <section className={styles.textContainer}>
                <Link
                    className={styles.linkName}
                    href={getLinkDirectors() as string}
                >
                    <p className={styles.directorName}>{currentDirector}</p>
                    <p className={styles.title}>« {currentTitle} »</p>
                </Link>
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
