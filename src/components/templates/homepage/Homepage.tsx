'use client'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { Link } from '@/i18n/routing'
import useMobile from '@/hooks/useMobile'
import CounterSlide from '@/components/molecules/counterSlide/CounterSlide'
import styles from './Homepage.module.scss'

interface HomepageProps {
    homepageData: HomepageData
}

export default function Homepage({ homepageData }: HomepageProps) {
    const isMobile = useMobile()

    const [currentVideo, setCurrentVideo] = useState<string | null>(null)
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const [currentDirector, setCurrentDirector] = useState<string>('')
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const videoRef = useRef<HTMLVideoElement>(null)
    const titleRef = useRef<HTMLParagraphElement>(null)
    const directorRef = useRef<HTMLParagraphElement>(null)
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
    const touchStartY = useRef<number | null>(null)

    const sortedVideos = React.useMemo(() => {
        if (!Array.isArray(homepageData)) {
            console.error('homepageData is not an array :', homepageData)
            return []
        }

        return [...homepageData].sort((a, b) => a.order - b.order)
    }, [homepageData])

    const getLinkDirectors = () => {
        let link
        if (currentDirector) {
            link = `directors/${currentDirector.toLowerCase()}`
        }
        return link
    }

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
                        (prevIndex) => (prevIndex + 1) % sortedVideos.length
                    )
                } else {
                    // Swipe vers le bas → Vidéo précédente
                    setCurrentIndex(
                        (prevIndex) =>
                            (prevIndex - 1 + sortedVideos.length) %
                            sortedVideos.length
                    )
                }
            }

            touchStartY.current = null // Reset pour la prochaine détection
        },
        [sortedVideos.length]
    )

    const handleScroll = useCallback(
        (event: WheelEvent) => {
            if (!isMobile) {
                event.preventDefault() // Empêcher le scroll SEULEMENT sur desktop
            }

            if (scrollTimeout.current) return

            // 🔥 Ignorer les petits scrolls (réduit la sensibilité du trackpad)
            const SCROLL_THRESHOLD = 10 // Seulement si deltaY > 50 ou < -50
            if (Math.abs(event.deltaY) < SCROLL_THRESHOLD) return

            // Détection de la direction du scroll
            if (event.deltaY > 0) {
                // Scroll vers le bas → Vidéo suivante
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % sortedVideos.length
                )
            } else if (event.deltaY < 0) {
                // Scroll vers le haut → Vidéo précédente
                setCurrentIndex(
                    (prevIndex) =>
                        (prevIndex - 1 + sortedVideos.length) %
                        sortedVideos.length
                )
            }

            // Ajoute un délai pour éviter le scroll trop rapide
            scrollTimeout.current = setTimeout(() => {
                scrollTimeout.current = null
            }, 800) // 800ms de délai entre chaque scroll
        },
        [sortedVideos.length, isMobile]
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

    useEffect(() => {
        if (!homepageData || sortedVideos.length === 0) return

        gsap.to(videoRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                const video = sortedVideos[currentIndex]
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
            const nextIndex = (currentIndex + 1) % sortedVideos.length
            setCurrentIndex(nextIndex)
        }, 15000)

        return () => clearInterval(interval)
    }, [currentIndex, sortedVideos, homepageData])

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
                        {currentTitle ? `" ${currentTitle} "` : ''}
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
                data={sortedVideos}
                index={currentIndex}
                setIndex={setCurrentIndex}
            />
        </main>
    )
}
