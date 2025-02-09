'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import { useGSAP } from '@gsap/react'
import { Link } from '@/i18n/routing'

import styles from './Directors.module.scss'

export default function Directors({ directorsData }: any) {
    const [currentVideo, setCurrentVideo] = useState<string>('')
    const [currentTitle, setCurrentTitle] = useState<string>('')

    const containerRef = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLParagraphElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)

    // For the first director, set the first video as the current video
    useEffect(() => {
        if (directorsData.length > 0) {
            const firstDirectorVideo =
                directorsData[0]?.videos?.[0]?.url?.[0]?.url ?? ''
            const firstTitleVideo = directorsData[0]?.videos?.[0]?.title

            setCurrentVideo(firstDirectorVideo)
            setCurrentTitle(firstTitleVideo)
        }
    }, [directorsData])

    // Animate the names
    useGSAP(() => {
        const names = containerRef.current?.querySelectorAll(`.${styles.name}`)
        if (names) {
            gsap.fromTo(
                names,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    stagger: 0.2,
                }
            )
        }

        gsap.fromTo(
            titleRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        )
    })
    // Handle video change with fade effect
    const handleMouseEnter = (videoUrl: string, title: string) => {
        console.log('Mouse Enter Triggered:', videoUrl, title) // Vérifiez que l'événement est déclenché
        const overlay = overlayRef.current
        console.log('videoUrl', videoUrl)

        if (overlay) {
            gsap.fromTo(
                overlay,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.5,
                    onComplete: () => {
                        console.log('Changing Video and Title') // Vérifiez l'étape d'animation
                        setCurrentVideo(videoUrl) // Change l'URL de la vidéo
                        setCurrentTitle(title) // Change le titre
                        gsap.to(overlay, { opacity: 0, duration: 0.5 })
                    },
                }
            )
        }
    }

    return (
        <main className={styles.directorContainer} ref={containerRef}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {directorsData.map((director: any, index: number) => {
                        const videoUrl =
                            director?.videos?.[0]?.url?.[0]?.url ?? ''
                        return (
                            <Link
                                key={index}
                                href={`/directors/${director.name}`}
                            >
                                <li
                                    key={index}
                                    className={styles.name}
                                    onMouseEnter={() =>
                                        handleMouseEnter(
                                            videoUrl,
                                            director?.videos[0]?.title
                                        )
                                    }
                                >
                                    {director.name}
                                </li>
                            </Link>
                        )
                    })}
                </ul>
                <div className={styles.titleVideo} ref={titleRef}>
                    <p>« {currentTitle} »</p>
                </div>
            </section>
            <section className={styles.videoContainer}>
                <div className={styles.overlay} ref={overlayRef}></div>
                {currentVideo && (
                    <video
                        className={styles.backgroundVideo}
                        src={currentVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                )}
            </section>
        </main>
    )
}
