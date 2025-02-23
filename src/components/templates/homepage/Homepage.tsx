/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { Link } from '@/i18n/routing'
import CounterSlide from '@/components/molecules/counterSlide/CounterSlide'
import styles from './Homepage.module.scss'
import useMobile from '@/hooks/useMobile'

export default function Homepage({ homepageData }: any) {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null)
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const [currentDirector, setCurrentDirector] = useState<string>('')
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const isMobile = useMobile()

    const sortedData = React.useMemo(() => {
        return (
            homepageData && [...homepageData].sort((a, b) => a.order - b.order)
        )
    }, [homepageData])

    const videoRef = useRef<HTMLVideoElement>(null)
    const titleRef = useRef<HTMLParagraphElement>(null)
    const directorRef = useRef<HTMLParagraphElement>(null)
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

    console.log('homepageData', homepageData)

    useEffect(() => {
        if (!homepageData || sortedData.length === 0) return

        gsap.to(videoRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                const video = sortedData[currentIndex]
                console.log('video', video)
                const videoUrl = video?.url?.[0]?.url
                setCurrentVideo(videoUrl as string)
                setCurrentTitle(video?.title || '')
                setCurrentDirector(
                    video?.director?.name || video?.directorNameBIS || ''
                )

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
        }, 15000)

        return () => clearInterval(interval)
    }, [currentIndex, sortedData, homepageData])

    const touchStartY = useRef<number | null>(null)

    const handleTouchStart = useCallback((event: TouchEvent) => {
        touchStartY.current = event.touches[0].clientY
    }, [])

    const handleTouchEnd = useCallback(
        (event: TouchEvent) => {
            if (!touchStartY.current) return

            const deltaY = touchStartY.current - event.changedTouches[0].clientY

            if (Math.abs(deltaY) > 50) {
                // Seuil pour éviter les faux mouvements
                if (deltaY > 0) {
                    // Swipe vers le haut → Vidéo suivante
                    setCurrentIndex(
                        (prevIndex) => (prevIndex + 1) % sortedData.length
                    )
                } else {
                    // Swipe vers le bas → Vidéo précédente
                    setCurrentIndex(
                        (prevIndex) =>
                            (prevIndex - 1 + sortedData.length) %
                            sortedData.length
                    )
                }
            }

            touchStartY.current = null // Reset pour la prochaine détection
        },
        [sortedData.length]
    )

    const handleScroll = useCallback(
        (event: WheelEvent) => {
            if (!isMobile) {
                event.preventDefault() // Empêcher le scroll SEULEMENT sur desktop
            }

            // Si un changement est déjà en cours, on ignore le scroll
            if (scrollTimeout.current) return

            // Détection de la direction du scroll
            if (event.deltaY > 0) {
                // Scroll vers le bas → Vidéo suivante
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % sortedData.length
                )
            } else if (event.deltaY < 0) {
                // Scroll vers le haut → Vidéo précédente
                setCurrentIndex(
                    (prevIndex) =>
                        (prevIndex - 1 + sortedData.length) % sortedData.length
                )
            }

            // Ajoute un délai pour éviter le scroll trop rapide
            scrollTimeout.current = setTimeout(() => {
                scrollTimeout.current = null
            }, 800) // 800ms de délai entre chaque scroll
        },
        [sortedData.length, isMobile]
    )

    useEffect(() => {
        window.addEventListener('wheel', handleScroll, { passive: false })

        return () => {
            window.removeEventListener('wheel', handleScroll)
        }
    }, [handleScroll])

    useEffect(() => {
        window.addEventListener('touchstart', handleTouchStart)
        window.addEventListener('touchend', handleTouchEnd)

        return () => {
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchend', handleTouchEnd)
        }
    }, [handleTouchStart, handleTouchEnd])

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
