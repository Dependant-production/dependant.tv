'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react'
import styles from './DirectorDetails.module.scss'
import SideNav from '@/components/molecules/sideNav/SideNav'

export default function DirectorDetails({ directorData }: any) {
    const [isVideoOpen, setIsVideoOpen] = useState(false)
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
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

    return (
        <main className={styles.directorDetails}>
            <h2 className={styles.title}>
                {firstPart}
                <br />
                {secondPart}
            </h2>

            <div className={styles.videosContainer}>
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
                                    autoPlay
                                    onClick={() => openVideo(vid.url)}
                                />
                                <div className={styles.videoTitle}>
                                    {video?.title}
                                </div>
                            </section>
                        ))}
                    </React.Fragment>
                ))}

                {isVideoOpen && currentVideoUrl && (
                    <div className={styles.videoLightbox} onClick={closeVideo}>
                        <div className={styles.videoContainer}>
                            <video
                                src={currentVideoUrl}
                                controls
                                autoPlay
                                className={styles.videoPlayer}
                            />
                        </div>
                    </div>
                )}

                {directorData[0]?.photographer && (
                    <div>
                        <SideNav
                            className={styles.nav}
                            srcDirector={`/directors/${directorData[0].name}`}
                            srcPhotographer={`/photographers/${directorData[0].photographer.name}`}
                        />
                    </div>
                )}
            </div>
        </main>
    )
}
