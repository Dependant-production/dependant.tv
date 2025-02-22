'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    projectDetails: any
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
                        modules={[Navigation, Mousewheel]} // Active les flèches de navigation
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
                        {images?.map((image: any, index: number) => (
                            <SwiperSlide key={index} className={styles.section}>
                                <Image
                                    className={styles.image}
                                    src={image.url}
                                    alt={image.title}
                                    width={500}
                                    height={600}
                                    layout="intrinsic"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className={styles.horizontalScroll}>
                        {images?.map((image: any, index: number) => (
                            <section key={index} className={styles.section}>
                                <Image
                                    className={styles.image}
                                    src={image.url}
                                    alt={image.title}
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
