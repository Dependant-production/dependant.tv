'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef } from 'react'
import styles from './PhotographerDetails.module.scss'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import useMobile from '@/hooks/useMobile'
import SideNav from '@/components/molecules/sideNav/SideNav'

export default function PhotographerDetails({ photographerData }: any) {
    const isMobile = useMobile()
    gsap.registerPlugin(ScrollTrigger)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null)

    const photos = photographerData[0]?.photos
    console.log('photographerData', photographerData)

    useGSAP(() => {
        if (isMobile) return null
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
            <h2 className={styles.title}>{photographerData[0]?.name}</h2>
            <div className={styles.horizontalScroll} ref={horizontalScrollRef}>
                {photos?.map((photo: any, photoIndex: number) => (
                    <React.Fragment key={photoIndex}>
                        {photo?.url?.map((image: any, imageIndex: number) => (
                            <section
                                key={`${photoIndex}-${imageIndex}`}
                                className={styles.section}
                            >
                                <Image
                                    src={image?.url || null}
                                    alt={
                                        photo?.title ||
                                        `Photo ${photoIndex + 1}-${
                                            imageIndex + 1
                                        }`
                                    }
                                    width={500}
                                    height={700}
                                    className={styles.image}
                                />
                            </section>
                        ))}
                    </React.Fragment>
                ))}
                {photographerData[0]?.director && (
                    <div>
                        <SideNav
                            className={styles.nav}
                            srcDirector={`/directors/${photographerData[0].director.name}`}
                            srcPhotographer={`/photographers/${photographerData[0].name}`}
                        />
                    </div>
                )}
            </div>
        </main>
    )
}
