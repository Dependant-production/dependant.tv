'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import styles from './DirectorDetails.module.scss'

export default function DirectorDetails({ directorData }: any) {
    const videos = directorData[0]?.videos

    return (
        <main className={styles.directorDetails}>
            <h2 className={styles.title}>{directorData[0]?.name}</h2>
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
                            </section>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </main>
    )
}
