'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from '@/i18n/routing'
import useMobile from '@/hooks/useMobile'
import styles from './PhotographerDetails.module.scss'

export default function PhotographerDetails({ photographerData }: any) {
    gsap.registerPlugin(ScrollTrigger)
    const isMobile = useMobile()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null)
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const titleRef = useRef<HTMLDivElement | null>(null)
    const [, setCurrentIndex] = useState(0)

    const projects = photographerData[0]?.projects
    const cutName = photographerData[0]?.name.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

    useGSAP(() => {
        gsap.fromTo(nameRef.current, { x: -400 }, { x: 0, duration: 1 })

        gsap.fromTo(
            titleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )
    }, [])
    useGSAP(() => {
        if (isMobile === undefined || isMobile) return
        const container = containerRef.current
        const horizontalScroll = horizontalScrollRef.current
        const sections = gsap.utils.toArray<HTMLElement>(`.${styles.section}`)

        if (!container || !horizontalScroll || !sections.length) return

        // Animation pour le scroll horizontal
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1), // Déplace toutes les sections horizontalement
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top top', // Déclencheur au début du conteneur
                end: () => `+=${container.offsetWidth * (sections.length - 1)}`, // Définit la fin du scrollTrigger
                scrub: 0.1, // Rend l'animation fluide
                pin: true, // Épingle le conteneur pendant le scroll
                snap: {
                    snapTo: 1 / (sections.length - 1), // Effet de magnétisme
                    duration: { min: 0.1, max: 0.3 }, // Durée du snap
                    ease: 'power1.inOut', // Effet d'easing
                },
                onUpdate: (self) => {
                    // Met à jour l'index actif
                    setCurrentIndex(
                        Math.round(self.progress * (sections.length - 1))
                    )
                },
            },
        })
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
        </>
    )
}
