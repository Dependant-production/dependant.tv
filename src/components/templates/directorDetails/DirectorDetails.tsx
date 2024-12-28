'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import styles from './DirectorDetails.module.scss'
import SideNav from '@/components/molecules/sideNav/SideNav'

export default function DirectorDetails({ directorData }: any) {
    const videos = directorData[0]?.videos

    const cutName = directorData[0]?.name.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

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
                                />
                                <div className={styles.videoTitle}>
                                    {video?.title}
                                </div>
                            </section>
                        ))}
                    </React.Fragment>
                ))}

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
