'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import styles from './Directors.module.scss'
import { Link } from '@/i18n/routing'

export default function Directors({ directorsData }: any) {
    const [currentVideo, setCurrentVideo] = useState<string>('')
    const [currentTitle, setCurrentTitle] = useState('')

    useEffect(() => {
        if (directorsData.length > 0) {
            const firstDirectorVideo =
                directorsData[0]?.videos?.[0]?.url?.[0]?.url ?? ''
            const firstDirectorTitle =
                directorsData[0]?.videos?.[0]?.title || ''

            setCurrentVideo(firstDirectorVideo)
            setCurrentTitle(firstDirectorTitle)
        }
    }, [directorsData])

    console.log('directorsData', directorsData)

    return (
        <main className={styles.directorContainer}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {directorsData.map((director: any, index: number) => {
                        const videoUrl =
                            director?.videos?.[0]?.url[0]?.url ?? ''
                        return (
                            <Link
                                key={index}
                                href={`/directors/${director.name}`}
                            >
                                <li
                                    key={index}
                                    className={styles.name}
                                    onMouseEnter={() => {
                                        setCurrentVideo(videoUrl as string)
                                        setCurrentTitle(
                                            director?.videos[0]?.title as string
                                        )
                                    }}
                                >
                                    {director.name}
                                </li>
                            </Link>
                        )
                    })}
                </ul>
                <div className={styles.titleVideo}>
                    <p>&quot;{currentTitle}&quot;</p>
                </div>
            </section>
            <section className={styles.videoContainer}>
                <video
                    className={styles.backgroundVideo}
                    src={currentVideo ?? null}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </section>
        </main>
    )
}
