'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import styles from './Directors.module.scss'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import axiosInstance from '@/helpers/axiosInstance'

export default function Directors() {
    const locale = useLocale()

    const [directorsData, setDirectorsData] = useState<any>([])
    const [currentVideo, setCurrentVideo] = useState('')
    const [currentTitle, setCurrentTitle] = useState('')

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await axiosInstance.get(
                    `/directors?locale=${locale}&populate=videos.url`
                )
                console.log('data', data)
                setDirectorsData(data?.data?.data)
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des articles :',
                    error
                )
            }
        }
        fetchNews()
    }, [locale])

    console.log('directorData', directorsData)

    return (
        <main className={styles.directorContainer}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {directorsData.map((director: any, index: number) => {
                        const videoUrl = director?.videos?.[0]?.url[0]?.url
                            ? `http://localhost:1337${director.videos[0].url[0]?.url}`
                            : ''
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
