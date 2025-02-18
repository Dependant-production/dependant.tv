'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef } from 'react'
import styles from './PhotographerDetails.module.scss'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import useMobile from '@/hooks/useMobile'
// import SideNav from '@/components/molecules/sideNav/SideNav'
import { Link } from '@/i18n/routing'

export default function PhotographerDetails({ photographerData }: any) {
    gsap.registerPlugin(ScrollTrigger)
    const isMobile = useMobile()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null)
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const titleRef = useRef<HTMLDivElement | null>(null)

    const projects = photographerData[0]?.projects
    const cutName = photographerData[0]?.name.split(' ')
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

        gsap.fromTo(
            nameRef.current,
            {
                x: -400,
            },
            { x: 0, duration: 0.5 }
        )

        gsap.fromTo(
            titleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )

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
                    snap: 1 / (section.length - 1),
                },
            })
        }
    }, [isMobile])

    const formattedSlug = photographerData[0]?.slug.replace(/-/g, '%20')
    return (
        <>
            <main className={styles.photographerDetails} ref={containerRef}>
                <h2 className={styles.title} ref={nameRef}>
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
                                    src={project?.coverMedia?.url || null}
                                    alt={project?.title}
                                    width={isMobile ? 300 : 500}
                                    height={isMobile ? 200 : 600}
                                    layout="intrinsic"
                                    className={styles.image}
                                />
                                <div
                                    className={styles.projectTitle}
                                    ref={titleRef}
                                >
                                    <p>{project?.title}</p>
                                </div>
                            </Link>
                        </section>
                    ))}
                </div>
            </main>
            {/* {photographerData[0]?.director && (
                <div>
                    <SideNav
                        className={styles.nav}
                        srcDirector={`/directors/${photographerData[0].director.name}`}
                        srcPhotographer={`/photographers/${photographerData[0].name}`}
                    />
                </div>
            )} */}
        </>
    )
}
