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
import { Link } from '@/i18n/routing'

export default function PhotographerDetails({ photographerData }: any) {
    const isMobile = useMobile()
    gsap.registerPlugin(ScrollTrigger)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null)

    const projects = photographerData[0]?.projects
    const cutName = photographerData[0]?.name.split(' ')
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

    const formattedSlug = photographerData[0].slug.replace(/-/g, '%20')
    return (
        <>
            <main className={styles.photographerDetails} ref={containerRef}>
                <h2 className={styles.title}>
                    {firstPart}
                    <br />
                    {secondPart}
                </h2>
                <div
                    className={styles.horizontalScroll}
                    ref={horizontalScrollRef}
                >
                    {projects?.map((project: any, projectIndex: number) => (
                        <section key={projectIndex} className={styles.section}>
                            <Link
                                key={projectIndex}
                                href={`/photographers/${formattedSlug}/${project.projectSlug}`}
                            >
                                <Image
                                    src={project?.coverMedia?.url || null}
                                    alt={project?.title}
                                    width={500}
                                    height={700}
                                    className={styles.image}
                                />
                                <div className={styles.projectTitle}>
                                    <h3>{project?.title}</h3>
                                </div>
                            </Link>
                        </section>
                    ))}
                </div>
            </main>
            {photographerData[0]?.director && (
                <div>
                    <SideNav
                        className={styles.nav}
                        srcDirector={`/directors/${photographerData[0].director.name}`}
                        srcPhotographer={`/photographers/${photographerData[0].name}`}
                    />
                </div>
            )}
        </>
    )
}
