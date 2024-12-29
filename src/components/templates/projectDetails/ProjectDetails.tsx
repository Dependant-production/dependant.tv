'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react'
import styles from './ProjectDetails.module.scss'
import gsap from 'gsap'
import useMobile from '@/hooks/useMobile'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

interface ProjectDetailsProps {
    projectDetails: any
    photographerName: string
}

function ProjectDetails({
    projectDetails,
    photographerName,
}: ProjectDetailsProps) {
    console.log('projectData', projectDetails)
    const isMobile = useMobile()
    gsap.registerPlugin(ScrollTrigger)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null)
    const images = projectDetails?.media

    const cutName = photographerName.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

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
        <>
            <main className={styles.projectDetails} ref={containerRef}>
                <h2 className={styles.name}>
                    {firstPart}
                    <br />
                    {secondPart}
                </h2>
                <div
                    className={styles.horizontalScroll}
                    ref={horizontalScrollRef}
                >
                    {images?.map((image: any, index: number) => (
                        <section key={index} className={styles.section}>
                            <Image
                                className={styles.image}
                                src={image.url}
                                alt="toto"
                                width={500}
                                height={700}
                            />
                        </section>
                    ))}
                </div>
                <h3 className={styles.title}>{projectDetails.title}</h3>
            </main>
        </>
    )
}

export default ProjectDetails
