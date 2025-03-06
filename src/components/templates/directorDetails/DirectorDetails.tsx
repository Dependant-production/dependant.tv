'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CounterVideo from '@/components/molecules/counterVideo/CounterVideo'
import styles from './DirectorDetails.module.scss'

interface DirectorProps {
    directorData: DirectorsDataType
}

export default function DirectorDetails({ directorData }: DirectorProps) {
    gsap.registerPlugin(ScrollTrigger)

    const [isVideoOpen, setIsVideoOpen] = useState(false)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const videoTitleRef = useRef<(HTMLDivElement | null)[]>([])
    const videoRefs = useRef<HTMLVideoElement[]>([])

    const videos = directorData[0]?.videos
    const cutName = directorData[0]?.name.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

    const openVideo = (url: string) => {
        setCurrentVideoUrl(url)
        setIsVideoOpen(true)
    }

    const closeVideo = () => {
        setCurrentVideoUrl(null)
        setIsVideoOpen(false)
    }

    useGSAP(() => {
        gsap.fromTo(
            nameRef.current,
            {
                opacity: 0,
            },
            { opacity: 1, duration: 1, ease: 'power2.out' }
        )
    })

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Trouver l'index de la vidéo visible
                        const index = videoRefs.current.findIndex(
                            (video) => video === entry.target
                        )
                        if (index !== -1) {
                            setCurrentIndex(index)
                        }
                    }
                })
            },
            { threshold: 0.6 } // On considère une vidéo visible si 60% de sa hauteur est à l'écran
        )

        // Observer chaque vidéo
        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video)
        })

        // Nettoyer l'observer quand le composant se démonte
        return () => observer.disconnect()
    }, [])

    return (
        <main className={styles.directorDetails}>
            <h2 className={styles.title} ref={nameRef}>
                {firstPart}
                <br />
                {secondPart}
            </h2>

            <div className={styles.videosContainer} ref={containerRef}>
                {videos?.map((video: VideoType, videoIndex: number) => (
                    <React.Fragment key={videoIndex}>
                        {video?.url?.map((vid: MediaType, vidIndex: number) => (
                            <section
                                key={`${videoIndex}-${vidIndex}`}
                                className={`${styles.section} section`}
                            >
                                <video
                                    src={vid?.url}
                                    className={styles.video}
                                    muted
                                    loop
                                    playsInline
                                    disablePictureInPicture
                                    webkit-playsinline="true"
                                    autoPlay={true}
                                    ref={(el) => {
                                        if (el) {
                                            videoRefs.current[videoIndex] = el // Référencer chaque vidéo
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault() // Empêche l'ouverture du lecteur vidéo natif sur mobile
                                        openVideo(vid.url)
                                    }}
                                />
                                <div
                                    className={styles.videoTitle}
                                    ref={(el) => {
                                        if (el) {
                                            videoTitleRef.current[videoIndex] =
                                                el
                                        }
                                    }}
                                >
                                    {video?.title}
                                </div>
                            </section>
                        ))}
                    </React.Fragment>
                ))}

                {isVideoOpen && currentVideoUrl && (
                    <div className={styles.videoLightbox}>
                        <div>
                            <h3 className={styles.videoTitlePlayer}>
                                {videos?.map((video: VideoType) =>
                                    video.url.map((vid: MediaType) =>
                                        vid.url === currentVideoUrl
                                            ? video.title
                                            : ''
                                    )
                                )}
                            </h3>
                        </div>
                        <div className={styles.videoContainer}>
                            <div onClick={closeVideo}>
                                <Image
                                    src="/cross.png"
                                    width={50}
                                    height={50}
                                    layout="intrinsic"
                                    alt="cross to close"
                                    className={styles.closeButton}
                                />
                            </div>

                            <video
                                src={currentVideoUrl}
                                controls
                                autoPlay={isVideoOpen}
                                controlsList="nodownload"
                                className={styles.videoPlayer}
                            />
                        </div>
                    </div>
                )}
                <CounterVideo
                    numberOfVideos={videos?.length}
                    currentIndex={currentIndex}
                />
            </div>
        </main>
    )
}
