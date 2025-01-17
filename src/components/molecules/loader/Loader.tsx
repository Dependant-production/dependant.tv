'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import styles from './Loader.module.scss'
import { useGSAP } from '@gsap/react'

export default function Loader() {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        gsap.fromTo(
            containerRef.current,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 0.2,
            }
        )
    })
    return (
        <main className={styles.loader} ref={containerRef}>
            <Image
                src="/logoDpdBlack.png"
                alt="loader"
                width={500}
                height={300}
                layout="intrinsic"
            />
        </main>
    )
}
