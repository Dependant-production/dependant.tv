'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useGSAP } from '@gsap/react'
import styles from './Photographers.module.scss'

interface PhotographerProps {
    photographersData: PhotographerDataType
}

export default function Photographers({
    photographersData,
}: PhotographerProps) {
    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null)
    const [currentTitle, setCurrentTitle] = useState<string>('')

    const containerRef = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLParagraphElement | null>(null)

    const sortedPhotographers = useMemo(() => {
        if (!Array.isArray(photographersData)) {
            console.error(
                'photographersData is not an array :',
                photographersData
            )
            return []
        }

        return [...photographersData].sort((a, b) => a.order - b.order)
    }, [photographersData])

    useGSAP(() => {
        const names = containerRef.current?.querySelectorAll(`.${styles.name}`)
        if (names) {
            gsap.fromTo(
                names,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.3,
                }
            )
        }

        gsap.fromTo(
            titleRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: 'power2.out' }
        )
    })

    // For the first photographer, set the first phoro as the current photo
    useEffect(() => {
        if (photographersData.length > 0) {
            const firstPhotographerPhoto =
                sortedPhotographers[0]?.photo?.url ?? null
            const firstPhotographerTitle =
                sortedPhotographers[0]?.titlePhoto ?? ''
            setCurrentPhoto(firstPhotographerPhoto)
            setCurrentTitle(firstPhotographerTitle)
        }
    }, [photographersData, sortedPhotographers])

    return (
        <main className={styles.photographerContainer} ref={containerRef}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {sortedPhotographers.map(
                        (photographer: PhotographerType, index: number) => {
                            const firstPhotographerPhoto =
                                photographer?.photo?.url ?? null
                            return (
                                <li
                                    key={index}
                                    className={styles.name}
                                    onMouseEnter={() => {
                                        setCurrentPhoto(firstPhotographerPhoto)
                                        setCurrentTitle(
                                            photographer?.titlePhoto as string
                                        )
                                    }}
                                >
                                    <Link
                                        href={`/photographers/${photographer.name}`}
                                        className={styles.link}
                                    >
                                        {photographer.name}
                                    </Link>
                                </li>
                            )
                        }
                    )}
                </ul>
                <div className={styles.titlePhoto} ref={titleRef}>
                    <p>{currentTitle}</p>
                </div>
            </section>
            <section className={styles.photoContainer}>
                {currentPhoto && (
                    <Image
                        fill
                        alt="background photo"
                        className={styles.backgroundPhoto}
                        src={currentPhoto as string}
                    />
                )}
            </section>
        </main>
    )
}
