'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import styles from './Directors.module.scss'
import { Link } from '@/i18n/routing'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Directors({ directorsData }: any) {
    const [currentVideo, setCurrentVideo] = useState<string>('')
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (directorsData.length > 0) {
            const firstDirectorVideo =
                directorsData[0]?.videos?.[0]?.url?.[0]?.url ?? ''
            const firstTitleVideo = directorsData[0]?.videos?.[0]?.title

            setCurrentVideo(firstDirectorVideo)
            setCurrentTitle(firstTitleVideo)
        }
    }, [directorsData])

    useGSAP(() => {
        const names = containerRef.current?.querySelectorAll(`.${styles.name}`)
        if (names) {
            gsap.fromTo(
                names,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.4 }
            )
        }
    })

    return (
        <main className={styles.directorContainer} ref={containerRef}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {directorsData.map((director: any, index: number) => {
                        const videoUrl =
                            director?.videos?.[0]?.url[0]?.url ?? ''
                        return (
                            <Link
                                key={index}
                                href={`/directors/${director.name}`}
                            >
                                <li
                                    key={index}
                                    className={styles.name}
                                    onMouseEnter={() => {
                                        setCurrentVideo(videoUrl as string)
                                        setCurrentTitle(
                                            director?.videos[0]?.title as string
                                        )
                                    }}
                                >
                                    {director.name}
                                </li>
                            </Link>
                        )
                    })}
                </ul>
                <div className={styles.titleVideo}>
                    <p>« {currentTitle} »</p>
                </div>
            </section>
            <section className={styles.videoContainer}>
                <video
                    className={styles.backgroundVideo}
                    src={currentVideo ?? null}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </section>
        </main>
    )
}
