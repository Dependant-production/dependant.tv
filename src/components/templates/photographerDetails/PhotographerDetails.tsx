'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMobile from '@/hooks/useMobile'
import styles from './PhotographerDetails.module.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Mousewheel } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import 'swiper/css/navigation'
import 'swiper/css/mousewheel'

interface PhotographerProps {
    photographerData: PhotographerDataType
}

export default function PhotographerDetails({
    photographerData,
}: PhotographerProps) {
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

    const [initialSlide, setInitialSlide] = useState(0)

    useGSAP(() => {
        gsap.fromTo(
            nameRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )

        gsap.fromTo(
            titleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )
    }, [])

    useEffect(() => {
        const lastProjectIndex = localStorage.getItem('lastProjectIndex')
        if (lastProjectIndex) {
            setInitialSlide(parseInt(lastProjectIndex, 10))
        }
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
                    key={initialSlide}
                    initialSlide={initialSlide}
                    modules={[Navigation, Mousewheel]} // Active les flèches de navigation et scroll
                    mousewheel={{
                        thresholdDelta: 30, // Réduit la sensibilité du trackpad (valeur par défaut : 0)
                        thresholdTime: 100, // Augmente le temps entre chaque scroll (valeur par défaut : 0)
                        sensitivity: 0.7, // Diminue la vitesse du scroll (0.5 à 1 fonctionne bien)
                    }}
                    navigation={{
                        // Configuration des flèches de navigation
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    spaceBetween={0} // Espace entre les slides
                    slidesPerView={1} // Nombre de slides visibles à la fois
                    className={styles.horizontalScroll}
                >
                    {projects?.map(
                        (project: ProjectType, projectIndex: number) => (
                            <SwiperSlide
                                key={projectIndex}
                                className={styles.section}
                                onClick={() =>
                                    localStorage.setItem(
                                        'lastProjectIndex',
                                        projectIndex.toString()
                                    )
                                }
                            >
                                <Link
                                    href={{
                                        pathname: `/photographers/${formattedSlug}/${project.projectSlug}`,
                                        query: { projectIndex },
                                    }}
                                    className={styles.link}
                                >
                                    <Image
                                        src={project?.coverMedia?.url ?? ''}
                                        alt={project?.title}
                                        width={500}
                                        height={600}
                                        layout="intrinsic"
                                        className={styles.image}
                                    />
                                    <div className={styles.projectTitle}>
                                        <p>{`"${project?.title}"`}</p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        )
                    )}

                    {/* Ajout des flèches de navigation */}
                    <svg
                        width="18"
                        height="16"
                        viewBox="0 0 18 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`swiper-button-prev ${styles.arrowLeft}`}
                    >
                        <path
                            d="M0.292893 7.29289C-0.0976314 7.68342 -0.0976315 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34314C8.46159 1.95262 8.46159 1.31946 8.07107 0.928931C7.68054 0.538407 7.04738 0.538407 6.65686 0.928931L0.292893 7.29289ZM18 7L1 7L1 9L18 9L18 7Z"
                            fill="black"
                        />
                    </svg>

                    <svg
                        width="18"
                        height="16"
                        viewBox="0 0 18 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`swiper-button-next ${styles.arrowRight}`}
                    >
                        <path
                            d="M17.7071 8.70711C18.0976 8.31658 18.0976 7.68342 17.7071 7.29289L11.3431 0.928932C10.9526 0.538408 10.3195 0.538408 9.92893 0.928932C9.53841 1.31946 9.53841 1.95262 9.92893 2.34315L15.5858 8L9.92893 13.6569C9.53841 14.0474 9.53841 14.6805 9.92893 15.0711C10.3195 15.4616 10.9526 15.4616 11.3431 15.0711L17.7071 8.70711ZM0 9H17V7H0V9Z"
                            fill="black"
                        />
                    </svg>
                </Swiper>
            ) : (
                <div className={styles.verticalScroll}>
                    {projects?.map(
                        (project: ProjectType, projectIndex: number) => (
                            <section
                                key={projectIndex}
                                className={styles.section}
                            >
                                <Link
                                    href={`/photographers/${formattedSlug}/${project.projectSlug}`}
                                    className={styles.link}
                                >
                                    <Image
                                        src={project?.coverMedia?.url ?? ''}
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
                        )
                    )}
                </div>
            )}
        </main>
    )
}
