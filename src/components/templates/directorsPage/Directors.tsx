'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import styles from './Directors.module.scss'
import client from '@/utils/contentful'
import { Link } from '@/i18n/routing'

interface Director {
    name: string | null
    videoUrl: string | null
    videoTitle: string | null
}

export default function Directors() {
    const [directorsData, setDirectorsData] = useState<Director[]>([])
    const [currentVideo, setCurrentVideo] = useState('')
    const [currentTitle, setCurrentTitle] = useState('')
    console.log('currenVideo', currentVideo)

    useEffect(() => {
        const fetchDirectors = async () => {
            try {
                const response = await client.getEntries({
                    content_type: 'directors',
                })
                const formattedData = response.items.map((item) => ({
                    name: item.fields.name as string,
                    videoUrl: item.fields.videoUrl as string, // ou `item.fields.videoFile.fields.file.url` si c'est un champ média
                    videoTitle: item.fields.videoTitle as string,
                }))
                console.log('formattedData', formattedData)
                setDirectorsData(formattedData)
                if (formattedData.length > 0) {
                    setCurrentVideo(formattedData[0].videoUrl)
                    setCurrentTitle(formattedData[0]?.videoTitle)
                }
            } catch (error) {
                console.error('Error fetching data from Contentful:', error)
            }
        }
        fetchDirectors()
    }, [])

    return (
        <main className={styles.directorContainer}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {directorsData.map((director, index) => (
                        <Link key={index} href={`/directors/${director.name}`}>
                            <li
                                key={index}
                                className={styles.name}
                                onMouseEnter={() => {
                                    setCurrentVideo(director.videoUrl as string)
                                    setCurrentTitle(
                                        director.videoTitle as string
                                    )
                                }}
                            >
                                {director.name}
                            </li>
                        </Link>
                    ))}
                </ul>
                <div>
                    <p>&quot;{currentTitle}&quot;</p>
                </div>
            </section>
            <section className={styles.videoContainer}>
                <video
                    className={styles.backgroundVideo}
                    // src={currentVideo ?? null}
                    src="/OtacosLea.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </section>
        </main>
    )
}
