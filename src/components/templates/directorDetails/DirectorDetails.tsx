'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
// import SideNav from '@/components/molecules/sideNav/SideNav'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './DirectorDetails.module.scss'
import Image from 'next/image'

export default function DirectorDetails({ directorData }: any) {
    gsap.registerPlugin(ScrollTrigger)

    const [isVideoOpen, setIsVideoOpen] = useState(false)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const videoTitleRef = useRef<(HTMLDivElement | null)[]>([])
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})

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

    console.log('directorData', directorData)

    useGSAP(() => {
        // const sections = containerRef.current?.querySelectorAll(
        //     `.${styles.section}`
        // )
        gsap.fromTo(
            nameRef.current,
            {
                x: -400,
            },
            { x: 0, duration: 1 }
        )

        // if (sections) {
        //     gsap.utils.toArray(sections).forEach((section: any) => {
        //         ScrollTrigger.create({
        //             trigger: section,
        //             start: 'top top',
        //             pin: true,
        //             pinSpacing: false,
        //         })
        //     })
        // }
    })

    useGSAP(() => {
        gsap.utils
            .toArray<HTMLElement>('.section')
            .forEach((section, index) => {
                ScrollTrigger.create({
                    trigger: section,
                    start: 'top center',
                    end: 'bottom center',
                    onEnter: () => {
                        Object.values(videoRefs.current).forEach((video) => {
                            if (video) {
                                video.pause() // Stoppe les autres vidéos
                            }
                        })

                        const video = videoRefs.current[`${index}-0`] // Vidéo de la section visible
                        if (video) {
                            video
                                .play()
                                .catch((err) =>
                                    console.log('Autoplay bloqué : ', err)
                                )
                        }
                    },
                    onLeaveBack: () => {
                        Object.values(videoRefs.current).forEach((video) => {
                            if (video) video.pause()
                        })
                    },
                })
            })
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
                    <React.Fragment key={videoIndex}>
                        {video?.url?.map((vid: any, vidIndex: number) => (
                            <section
                                key={`${videoIndex}-${vidIndex}`}
                                className={styles.section}
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
                                            videoRefs.current[
                                                `${videoIndex}-${vidIndex}`
                                            ] = el
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
                                {videos?.map((video: any) =>
                                    video.url.map((vid: any) =>
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

                {/* {directorData[0]?.photographer && (
                    <div>
                        <SideNav
                            className={styles.nav}
                            srcDirector={`/directors/${directorData[0].name}`}
                            srcPhotographer={`/photographers/${directorData[0].photographer.name}`}
                        />
                    </div>
                )} */}
            </div>
        </main>
    )
}
