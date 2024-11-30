'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef } from 'react'
import styles from './PhotographerDetails.module.scss'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'

export default function PhotographerDetails({ photographerData }: any) {
    gsap.registerPlugin(ScrollTrigger)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null)

    const photos = photographerData[0]?.photos

    useGSAP(() => {
        const container = containerRef.current
        const horizontalScroll = horizontalScrollRef.current

        if (!container || !horizontalScroll) return null

        const scrollWidth = horizontalScroll.scrollWidth - window.innerWidth
        gsap.to(horizontalScrollRef.current, {
            x: -scrollWidth, // Déplace le conteneur horizontal
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: `+=${scrollWidth}`,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                markers: true,
            },
        })
    })

    return (
        <main className={styles.photographerDetails} ref={containerRef}>
            <h2 className={styles.title}>photographer name</h2>
            <div className={styles.horizontalScroll} ref={horizontalScrollRef}>
                {photos?.map((photo: any, index: number) => (
                    <section key={index} className={styles.section}>
                        <Image
                            src={photo.url[0]?.url}
                            alt={photo.title || `Photo ${index + 1}`}
                            width={500}
                            height={700}
                            className={styles.image}
                        />
                    </section>
                ))}
            </div>
        </main>
    )
}
