'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMobile from '@/hooks/useMobile'
import styles from './ProjectDetails.module.scss'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Mousewheel } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import 'swiper/css/navigation'
import 'swiper/css/mousewheel'

interface ProjectDetailsProps {
    projectDetails: ProjectType
    photographerName: string
}

function ProjectDetails({
    projectDetails,
    photographerName,
}: ProjectDetailsProps) {
    gsap.registerPlugin(ScrollTrigger)
    const isMobile = useMobile()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const images = projectDetails?.media

    const cutName = photographerName.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

    console.log('projectDetails', projectDetails)

    return (
        <>
            <main className={styles.projectDetails} ref={containerRef}>
                <h2 className={styles.name}>
                    {firstPart}
                    <br />
                    {secondPart}
                </h2>
                {!isMobile ? (
                    <Swiper
                        modules={[Navigation, Mousewheel]} // Active le scroll horizontal
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
                        onSlideChange={(swiper) => {
                            console.log('Slide actuel :', swiper.activeIndex)
                        }}
                        className={styles.horizontalScroll}
                    >
                        {images?.map((image: MediaType, index: number) => (
                            <SwiperSlide key={index} className={styles.section}>
                                <Image
                                    className={styles.image}
                                    src={image.url}
                                    alt={image.name}
                                    width={500}
                                    height={600}
                                    layout="intrinsic"
                                />
                            </SwiperSlide>
                        ))}
                        <div
                            className={`swiper-button-prev ${styles.arrowLeft}`}
                        />
                        <div
                            className={`swiper-button-next ${styles.arrowRight}`}
                        />
                    </Swiper>
                ) : (
                    <div className={styles.horizontalScroll}>
                        {images?.map((image: MediaType, index: number) => (
                            <section key={index} className={styles.section}>
                                <Image
                                    className={styles.image}
                                    src={image.url}
                                    alt={image.name}
                                    width={300}
                                    height={200}
                                    layout="intrinsic"
                                />
                            </section>
                        ))}
                    </div>
                )}

                <h3 className={styles.title}>{projectDetails.title}</h3>
            </main>
        </>
    )
}

export default ProjectDetails
