/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { Link } from '@/i18n/routing'
import CounterSlide from '@/components/molecules/counterSlide/CounterSlide'
import styles from './Homepage.module.scss'

export default function Homepage({ homepageData }: any) {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null)
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const [currentDirector, setCurrentDirector] = useState<string>('')
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const sortedData = React.useMemo(() => {
        return [...homepageData].sort((a, b) => a.order - b.order)
    }, [homepageData])

    const videoRef = useRef<HTMLVideoElement>(null)
    const titleRef = useRef<HTMLParagraphElement>(null)
    const directorRef = useRef<HTMLParagraphElement>(null)

    console.log('homepageData', homepageData)

    useEffect(() => {
        if (!homepageData || sortedData.length === 0) return

        gsap.to(videoRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                const video = sortedData[currentIndex]
                const videoUrl = video?.url?.[0]?.url
                setCurrentVideo(videoUrl as string)
                setCurrentTitle(video?.title || '')
                setCurrentDirector(video?.director?.name || '')

                gsap.to(videoRef.current, {
                    opacity: 1,
                    duration: 1,
                })

                gsap.fromTo(
                    directorRef.current,
                    { visibility: 'hidden' },
                    { visibility: 'visible', duration: 0.5 }
                )

                gsap.fromTo(
                    titleRef.current,
                    { visibility: 'hidden' },
                    { visibility: 'visible', duration: 0.5, delay: 0.5 }
                )
            },
        })

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % sortedData.length
            setCurrentIndex(nextIndex)
        }, 8000)

        return () => clearInterval(interval)
    }, [currentIndex, sortedData, homepageData])

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
                    <p ref={directorRef} className={styles.directorName}>
                        {currentDirector}
                    </p>
                    <p ref={titleRef} className={styles.title}>
                        {currentTitle ? `« ${currentTitle} »` : ''}
                    </p>
                </Link>
            </section>

            <section className={styles.videoContainer}>
                <video
                    ref={videoRef}
                    className={styles.backgroundVideo}
                    src={currentVideo as string}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </section>
            <CounterSlide
                className={styles.counter}
                data={sortedData}
                index={currentIndex}
                setIndex={setCurrentIndex}
            />
        </main>
    )
}
