/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import styles from './Photographers.module.scss'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

export default function Photographers({ photographersData }: any) {
    const [currentPhoto, setCurrentPhoto] = useState('')
    const [currentTitle, setCurrentTitle] = useState('')

    useEffect(() => {
        if (photographersData.length > 0) {
            const firstPhotographerPhoto = photographersData[0]?.photos[0]
                ?.url[0]?.url
                ? `http://localhost:1337${photographersData[0]?.photos[0]?.url[0]?.url}`
                : ''
            const firstPhotographerTitle =
                photographersData[0]?.photos?.[0]?.title || ''

            setCurrentPhoto(firstPhotographerPhoto)
            setCurrentTitle(firstPhotographerTitle)
        }
    }, [photographersData])

    return (
        <main className={styles.photographerContainer}>
            <section className={styles.textContainer}>
                <ul className={styles.nameContainer}>
                    {photographersData.map(
                        (photographer: any, index: number) => {
                            const firstPhotographerPhoto = photographer
                                ?.photos[0]?.url[0]?.url
                                ? `http://localhost:1337${photographer?.photos[0]?.url[0]?.url}`
                                : ''
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
                                                photographer?.photos[0]
                                                    ?.title as string
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
                <div className={styles.titlePhoto}>
                    <p>&quot;{currentTitle}&quot;</p>
                </div>
            </section>
            <section className={styles.photoContainer}>
                <Image
                    width={500}
                    height={500}
                    alt="background photo"
                    className={styles.backgroundPhoto}
                    src={currentPhoto ?? null}
                />
            </section>
        </main>
    )
}
