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
        if (isMobile === undefined || isMobile) return
        const container = containerRef.current
        const horizontalScroll = horizontalScrollRef.current
        const sections = containerRef.current?.querySelectorAll(
            `.${styles.section}`
        )

        if (!container || !horizontalScroll) return null

        const scrollWidth = horizontalScroll.scrollWidth - window.innerWidth

        if (sections) {
            const section = gsap.utils.toArray(sections)
            gsap.to(section, {
                xPercent: -100 * (section.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    end: `+=${scrollWidth}`,
                    scrub: 0.1,
                    pin: true,
                    snap: 1 / (section.length - 1),
                },
            })
        }
    }, [isMobile])

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
                                alt={image.title}
                                width={isMobile ? 300 : 500}
                                height={isMobile ? 200 : 600}
                                layout="intrinsic"
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
