'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMobile from '@/hooks/useMobile'
import styles from './PhotographerDetails.module.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Mousewheel } from 'swiper/modules'
import 'swiper/swiper-bundle.css' // Styles de base de Swiper
import 'swiper/css/navigation'
import 'swiper/css/mousewheel'

export default function PhotographerDetails({ photographerData }: any) {
    gsap.registerPlugin(ScrollTrigger)
    const isMobile = useMobile()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const titleRef = useRef<HTMLDivElement | null>(null)

    const projects = photographerData[0]?.projects
    const cutName = photographerData[0]?.name.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''
    const formattedSlug = photographerData[0]?.slug.replace(/-/g, '%20')

    useGSAP(() => {
        gsap.fromTo(nameRef.current, { x: -400 }, { x: 0, duration: 1 })

        gsap.fromTo(
            titleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )
    }, [])

    return (
        <main className={styles.photographerDetails} ref={containerRef}>
            <h2 className={styles.title} ref={nameRef}>
                {firstPart}
                <br />
                {secondPart}
            </h2>
            {!isMobile ? (
                <Swiper
                    modules={[Navigation, Mousewheel]} // Active les flèches de navigation et scroll
                    mousewheel={true}
                    navigation={{
                        // Configuration des flèches de navigation
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    spaceBetween={0} // Espace entre les slides
                    slidesPerView={1} // Nombre de slides visibles à la fois
                    onSlideChange={(swiper) => {
                        console.log('Slide actuel :', swiper.activeIndex)
                    }}
                    className={styles.horizontalScroll}
                >
                    {projects?.map((project: any, projectIndex: number) => (
                        <SwiperSlide
                            key={projectIndex}
                            className={styles.section}
                        >
                            <Link
                                href={`/photographers/${formattedSlug}/${project.projectSlug}`}
                                className={styles.link}
                            >
                                <Image
                                    src={project?.coverMedia?.url || null}
                                    alt={project?.title}
                                    width={500}
                                    height={600}
                                    layout="intrinsic"
                                    className={styles.image}
                                />
                                <div className={styles.projectTitle}>
                                    <p>{project?.title}</p>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}

                    {/* Ajout des flèches de navigation */}
                    <div className={`swiper-button-prev ${styles.arrowLeft}`} />
                    <div
                        className={`swiper-button-next ${styles.arrowRight}`}
                    />
                </Swiper>
            ) : (
                <div className={styles.verticalScroll}>
                    {projects?.map((project: any, projectIndex: number) => (
                        <section key={projectIndex} className={styles.section}>
                            <Link
                                href={`/photographers/${formattedSlug}/${project.projectSlug}`}
                                className={styles.link}
                            >
                                <Image
                                    src={project?.coverMedia?.url || null}
                                    alt={project?.title}
                                    width={300} // Taille fixe pour le mobile
                                    height={200}
                                    layout="intrinsic"
                                    className={styles.image}
                                />
                                <div className={styles.projectTitle}>
                                    <p>{project?.title}</p>
                                </div>
                            </Link>
                        </section>
                    ))}
                </div>
            )}
        </main>
    )
}
