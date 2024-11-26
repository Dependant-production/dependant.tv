'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useEffect } from 'react'
import styles from './PhotographerDetails.module.scss'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

export default function PhotographerDetails({ photographerData }: any) {
    gsap.registerPlugin(ScrollTrigger)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null)

    const photos = photographerData[0]?.photos

    useEffect(() => {
        if (!containerRef.current || !horizontalScrollRef.current) return

        const container = containerRef.current
        const horizontalScroll = horizontalScrollRef.current

        const scrollWidth = horizontalScroll.scrollWidth

        gsap.to(horizontalScroll, {
            x: -scrollWidth + window.innerWidth, // Déplace le conteneur horizontal
            ease: 'none',
            scrollTrigger: {
                trigger: container, // Conteneur principal
                start: 'top top',
                end: () => `+=${scrollWidth}`, // Définit la fin selon la largeur du contenu
                scrub: true,
                pin: true,
                anticipatePin: 1,
            },
        })
    }, [])

    return (
        <main className={styles.photographerDetails} ref={containerRef}>
            <div className={styles.horizontalScroll} ref={horizontalScrollRef}>
                {photos?.map((photo: any, index: number) => (
                    <section key={index} className={styles.section}>
                        <h2 className={styles.title}>{photo.title}</h2>
                        <Image
                            src={`http://localhost:1337${photo.url[0]?.url}`}
                            alt={photo.title || `Photo ${index + 1}`}
                            width={500}
                            height={500}
                            className={styles.image}
                        />
                    </section>
                ))}
            </div>
        </main>
    )
}
