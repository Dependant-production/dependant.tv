'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Link } from '@/i18n/routing'
import styles from './Directors.module.scss'

interface DirectorProps {
    directorsData: DirectorsDataType
}

export default function Directors({ directorsData }: DirectorProps) {
    const [currentVideo, setCurrentVideo] = useState<string>('')
    const [currentTitle, setCurrentTitle] = useState<string>('')

    const containerRef = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLParagraphElement | null>(null)
    const overlayRef = useRef<HTMLDivElement | null>(null)

    // Handle video change with fade effect
    const handleMouseEnter = (videoUrl: string, title: string) => {
        const overlay = overlayRef.current

        if (overlay) {
            gsap.fromTo(
                overlay,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    onComplete: () => {
                        setCurrentVideo(videoUrl)
                        setCurrentTitle(title)
                        gsap.to(overlay, { opacity: 0, duration: 1 })
                    },
                }
            )
        }
    }

    // Animate the names and titles
    useGSAP(() => {
        const names = containerRef.current?.querySelectorAll(`.${styles.name}`)
        if (names) {
            gsap.fromTo(
                names,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.3,
                }
            )
        }

        gsap.fromTo(
            titleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: 'power2.out' }
        )
    })

    // For the first director, set the first video as the current video
    useEffect(() => {
        if (directorsData.length > 0) {
            const firstDirectorVideo =
                directorsData[0]?.coverVideo?.url ??
                directorsData[0]?.videos?.[0]?.url?.[0]?.url
            const firstTitleVideo =
                directorsData[0]?.titleVideo ??
                directorsData[0]?.videos?.[0]?.title

            setCurrentVideo(firstDirectorVideo)
            setCurrentTitle(firstTitleVideo)
        }
    }, [directorsData])

    console.log('directorsData', directorsData)
    return (
        <main className={styles.directorContainer} ref={containerRef}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {directorsData.map(
                        (director: DirectorType, index: number) => {
                            const videoUrl =
                                director?.coverVideo?.url ??
                                director?.videos?.[0]?.url?.[0]?.url
                            return (
                                <li
                                    key={index}
                                    className={styles.name}
                                    onMouseEnter={() =>
                                        handleMouseEnter(
                                            videoUrl,
                                            director?.titleVideo ??
                                                director?.videos[0]?.title
                                        )
                                    }
                                >
                                    <Link
                                        href={`/directors/${director.name}`}
                                        className={styles.link}
                                    >
                                        {director.name}
                                    </Link>
                                </li>
                            )
                        }
                    )}
                </ul>
                <div className={styles.titleVideo} ref={titleRef}>
                    <p>{`" ${currentTitle} "`}</p>
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
