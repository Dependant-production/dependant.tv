/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

import { Link } from '@/i18n/routing'
import { useGSAP } from '@gsap/react'
import useMobile from '@/hooks/useMobile'

import styles from './Photographers.module.scss'

export default function Photographers({ photographersData }: any) {
    const isMobile = useMobile()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const titleRef = useRef<HTMLParagraphElement | null>(null)

    const [currentPhoto, setCurrentPhoto] = useState<string | null>(null)
    const [currentTitle, setCurrentTitle] = useState<string>('')

    console.log('currentTitle', currentTitle)

    // For the first photographer, set the first phoro as the current photo
    useEffect(() => {
        if (photographersData.length > 0) {
            const firstPhotographerPhoto =
                photographersData[0]?.photo?.url ?? null
            const firstPhotographerTitle =
                photographersData[0]?.titlePhoto ?? ''
            console.log('firstPhotographerTitle', firstPhotographerTitle)
            setCurrentPhoto(firstPhotographerPhoto)
            setCurrentTitle(firstPhotographerTitle)
        }
    }, [photographersData])

    console.log('photographersData', photographersData)

    useGSAP(() => {
        const names = containerRef.current?.querySelectorAll(`.${styles.name}`)
        if (names) {
            gsap.fromTo(
                names,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    stagger: 0.2,
                }
            )
        }

        gsap.fromTo(
            titleRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        )
    })

    return (
        <main className={styles.photographerContainer} ref={containerRef}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {photographersData.map(
                        (photographer: any, index: number) => {
                            const firstPhotographerPhoto =
                                photographer?.photo?.url ?? null
                            return (
                                <Link
                                    key={index}
                                    href={`/photographers/${photographer.name}`}
                                >
                                    <li
                                        key={index}
                                        className={styles.name}
                                        onMouseEnter={() => {
                                            setCurrentPhoto(
                                                firstPhotographerPhoto
                                            )
                                            setCurrentTitle(
                                                photographer?.titlePhoto as string
                                            )
                                        }}
                                    >
                                        {photographer.name}
                                    </li>
                                </Link>
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
                        width={isMobile ? 300 : 500}
                        height={isMobile ? 200 : 600}
                        layout="intrinsic"
                        alt="background photo"
                        className={styles.backgroundPhoto}
                        src={currentPhoto as string}
                    />
                )}
            </section>
        </main>
    )
}
