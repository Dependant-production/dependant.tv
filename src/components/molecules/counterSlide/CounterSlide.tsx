/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styles from './CounterSlide.module.scss'

interface CounterSlideProps {
    className?: string
    data: any
    index: number
}

export default function CounterSlide({
    className,
    data,
    index,
}: CounterSlideProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const currentNumberRef = useRef<HTMLDivElement | null>(null)
    const numberOfVideos = data.length
    const [currentOrder, setCurrentOrder] = useState(data[index]?.order || 0)
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        if (firstLoad) {
            setFirstLoad(false)
        }
    }, [firstLoad])

    useGSAP(() => {
        if (firstLoad) return
        const current = currentNumberRef.current
        console.log('current', current)

        if (current) {
            // Timeline pour synchroniser les animations
            const tl = gsap.timeline()
            tl.to(current, {
                y: -100,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    setCurrentOrder(data[index]?.order || 0)
                    gsap.set(current, { y: 100, opacity: 0 })
                },
            })

            // Le nouveau numéro descend et devient visible
            tl.to(current, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.inOut',
            })
        }
    }, [index])

    if (numberOfVideos === 0 || index < 0 || index >= numberOfVideos) {
        return null
    }

    return (
        <div className={` ${styles.counter} ${className}`} ref={containerRef}>
            <div ref={currentNumberRef}>{currentOrder}</div>
            <span>/{numberOfVideos}</span>
        </div>
    )
}
