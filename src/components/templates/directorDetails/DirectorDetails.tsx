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

    const containerRef = useRef<HTMLDivElement | null>(null)
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const videoRefs = useRef<HTMLElement[]>([])

    const projectVideos = directorData[0]?.project_videos
    const cutName = directorData[0]?.name.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

    const totalVideos = projectVideos?.reduce((acc: number, project: any) => {
        return acc + (project.mux_video_uploader_mux_assets?.length || 0)
    }, 0)

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
                        const videoIndex = videoRefs.current.findIndex(
                            (section) => section === entry.target
                        )
                        if (videoIndex !== -1) {
                            setCurrentIndex(videoIndex)

                            // 🔥 On ne touche qu'à la vidéo visible
                            const section = videoRefs.current[videoIndex]
                            const player = section.querySelector(
                                'mux-player'
                            ) as any

                            if (player) {
                                player.currentTime = 0
                                player.play()
                            }
                        }
                    }
                })
            },
            { threshold: 0.6 }
        )

        videoRefs.current.forEach((section) => {
            if (section) observer.observe(section)
        })

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
                {projectVideos?.map(
                    (project: any, projectIndex: number) =>
                        project.mux_video_uploader_mux_assets?.map(
                            (video: any, videoIndex: number) => {
                                const globalIndex =
                                    projectVideos
                                        .slice(0, projectIndex) // 🔹 On prend les projets précédents
                                        .reduce(
                                            (acc, proj) =>
                                                acc +
                                                (proj
                                                    .mux_video_uploader_mux_assets
                                                    ?.length || 0),
                                            0
                                        ) + videoIndex

                                return (
                                    <section
                                        key={`${projectIndex}-${videoIndex}`}
                                        className={`${styles.section} section`}
                                        ref={(el) => {
                                            if (el) {
                                                videoRefs.current[globalIndex] =
                                                    el // 🔹 On stocke l’index global de la vidéo
                                            }
                                        }}
                                    >
                                        <MuxSnippet
                                            playbackId={video.playback_id}
                                            onClick={() =>
                                                openVideo(video.playback_id)
                                            }
                                            isActive={
                                                globalIndex === currentIndex
                                            }
                                        />

                                        <div className={styles.videoTitle}>
                                            {`"${project?.title}"`}
                                        </div>
                                    </section>
                                )
                            }
                        )
                )}
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
                            accentColor="grey"
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
                numberOfVideos={totalVideos}
                currentIndex={currentIndex}
            />
        </main>
    )
}
