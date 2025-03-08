/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CounterVideo from '@/components/molecules/counterVideo/CounterVideo'
import styles from './DirectorDetails.module.scss'
import MuxPlayer from '@mux/mux-player-react'
import MuxSnippet from '@/components/atoms/muxSnippet/MuxSnippet'

interface DirectorProps {
    directorData: DirectorsDataType
}

export default function DirectorDetails({ directorData }: DirectorProps) {
    gsap.registerPlugin(ScrollTrigger)

    const [isVideoOpen, setIsVideoOpen] = useState(false)
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    console.log('currentVideoId', currentVideoId)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const videoRefs = useRef<HTMLVideoElement[]>([])

    const videos = directorData[0]?.mux_video_uploader_mux_assets
    const cutName = directorData[0]?.name.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

    console.log('videos', videos)

    const openVideo = (id: string) => {
        setCurrentVideoId(id)
        setIsVideoOpen(true)
    }

    const closeVideo = () => {
        setCurrentVideoId(null)
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
                {videos?.map((video: any, videoIndex: number) => (
                    <section
                        key={videoIndex}
                        className={`${styles.section} section`}
                    >
                        <MuxSnippet
                            playbackId={video.playback_id}
                            onClick={() => openVideo(video.playback_id)}
                        />
                    </section>
                ))}
            </div>
            {isVideoOpen && currentVideoId && (
                <div className={styles.videoLightbox} onClick={closeVideo}>
                    <div
                        className={styles.videoContainer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MuxPlayer
                            playbackId={currentVideoId}
                            streamType="on-demand"
                            autoPlay={true}
                            className={styles.player}
                        />
                    </div>
                    <Image
                        src="/cross.png"
                        width={50}
                        height={50}
                        layout="intrinsic"
                        alt="close"
                        className={styles.closeButton}
                        onClick={closeVideo}
                    />
                </div>
            )}
            <CounterVideo
                numberOfVideos={videos?.length}
                currentIndex={currentIndex}
            />
        </main>
    )
}
