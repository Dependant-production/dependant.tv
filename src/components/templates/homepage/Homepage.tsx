/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import styles from './Homepage.module.scss'
import axiosInstance from '@/helpers/axiosInstance'

export default function Homepage() {
    const [homepageVideos, setHomepageVideos] = useState<any>([])
    const [currentVideo, setCurrentVideo] = useState<any>('')
    const [currentTitle, setCurrentTitle] = useState('')
    const [currentDirector, setCurrentDirector] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    const updateVideo = (index: number, videos: any[]) => {
        const video = videos[index]
        const videoUrl = video?.url[0]?.url

        setCurrentVideo(videoUrl ? `http://localhost:1337${videoUrl}` : '')
        setCurrentTitle(video?.title || '')
        setCurrentDirector(video?.director?.name || '')
    }

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axiosInstance.get(
                    '/homepage-videos?populate=*'
                )
                const data = response.data?.data || []

                const sortedVideos = data.sort(
                    (a: any, b: any) => a?.order - b?.order
                )

                setHomepageVideos(sortedVideos)

                if (sortedVideos.length > 0) {
                    updateVideo(0, sortedVideos)
                }
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des vidéos :',
                    error
                )
            }
        }

        fetchVideos()
    }, [])

    useEffect(() => {
        // Changer la vidéo toutes les 5 secondes
        const interval = setInterval(() => {
            if (homepageVideos.length > 0) {
                // Calculer l'index de la vidéo suivante dans l'ordre
                const nextIndex = (currentIndex + 1) % homepageVideos.length
                setCurrentIndex(nextIndex)
                updateVideo(nextIndex, homepageVideos)
            }
        }, 5000) // 5 secondes

        return () => clearInterval(interval) // Nettoyer l'intervalle au démontage du composant
    }, [currentIndex, homepageVideos])

    return (
        <main className={styles.homepage}>
            <section className={styles.textContainer}>
                <p className={styles.directorName}>{currentDirector}</p>
                <p>&quot;{currentTitle}&quot;</p>
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
