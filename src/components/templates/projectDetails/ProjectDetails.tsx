/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useRef, useState } from 'react'
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
    const swiperRef = useRef<any | null>(null)
    const images = projectDetails?.media

    const cutName = photographerName.split(' ')
    const firstPart = cutName?.[0] || ''
    const secondPart = cutName?.slice(1).join(' ') || ''

    const [cursor, setCursor] = useState('default') // Par défaut, flèche gauche

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const { offsetX, target } = e.nativeEvent
        const targetElement = target as HTMLImageElement
        const imageWidth = targetElement.clientWidth

        if (offsetX < imageWidth / 2) {
            setCursor("url('/arrowLeft.png'), auto") // Curseur flèche gauche
        } else {
            setCursor("url('/arrowRight.png'), auto") // Curseur flèche droite
        }
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { offsetX, target } = e.nativeEvent
        const targetElement = target as HTMLImageElement
        const imageWidth = targetElement.clientWidth

        if (swiperRef.current) {
            if (offsetX < imageWidth / 2) {
                swiperRef.current.slidePrev() // Aller à l'image précédente
            } else {
                swiperRef.current.slideNext() // Aller à l'image suivante
            }
        }
    }

    return (
        <>
            <main
                className={styles.projectDetails}
                ref={containerRef}
                style={{ cursor }}
            >
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
                        spaceBetween={0} // Espace entre les slides
                        slidesPerView={1} // Nombre de slides visibles à la fois
                        className={styles.horizontalScroll}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {images?.map((image: MediaType, index: number) => (
                            <SwiperSlide key={index} className={styles.section}>
                                <div
                                    className={styles.imageContainer}
                                    onMouseMove={handleMouseMove}
                                    onClick={handleClick}
                                >
                                    <Image
                                        className={styles.image}
                                        src={image.url}
                                        alt={image.name}
                                        width={500}
                                        height={600}
                                        layout="intrinsic"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
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
