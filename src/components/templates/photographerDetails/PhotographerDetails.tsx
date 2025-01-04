'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useState } from 'react'
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

    const [isHover, setIsHover] = useState(false)

    const projects = photographerData[0]?.projects
    const cutName = photographerData[0]?.name.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

    console.log('photographerData', photographerData)

    console.log('isMobile', isMobile)

    useGSAP(() => {
        if (isMobile === undefined || isMobile) return
        const container = containerRef.current
        const horizontalScroll = horizontalScrollRef.current
        const sections = containerRef.current?.querySelectorAll(
            `.${styles.section}`
        )
        if (!container || !horizontalScroll) return null

        const scrollWidth = horizontalScroll.scrollWidth - window.innerWidth

        if (sections && !isMobile) {
            const section = gsap.utils.toArray(sections)
            gsap.to(section, {
                xPercent: -100 * (section.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    end: `+=${scrollWidth}`,
                    scrub: 0.1,
                    pin: true,
                    markers: true,
                    snap: 1 / (section.length - 1),
                },
            })
        }
    }, [isMobile])

    const formattedSlug = photographerData[0]?.slug.replace(/-/g, '%20')
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
                                className={styles.link}
                            >
                                <Image
                                    onMouseEnter={() => setIsHover(true)}
                                    onMouseLeave={() => setIsHover(false)}
                                    src={project?.coverMedia?.url || null}
                                    alt={project?.title}
                                    width={isMobile ? 300 : 500}
                                    height={isMobile ? 200 : 300}
                                    layout="intrinsic"
                                    className={`${styles.image} ${
                                        isHover ? styles.hover : ''
                                    }`}
                                />
                                {isHover && (
                                    <div className={styles.projectTitle}>
                                        <h3>{project?.title}</h3>
                                    </div>
                                )}
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
