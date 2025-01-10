/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styles from './CounterSlide.module.scss'

interface CounterSlideProps {
    className?: string
    data: any
    index: number
    setIndex: (index: number) => void
}

export default function CounterSlide({
    className,
    data,
    index,
    setIndex,
}: CounterSlideProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const currentNumberRef = useRef<HTMLDivElement | null>(null)
    const numberOfVideos = data.length
    const [currentOrder, setCurrentOrder] = useState(data[index]?.order || 0)
    const [firstLoad, setFirstLoad] = useState(true)
    const [isHover, setIsHover] = useState(false)

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

            // Le nouveau numéro monte et devient visible
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

    console.log('isHover', isHover)

    const handleHoverEnter = () => {
        setIsHover(true)
    }

    const handleHoverLeave = () => {
        setIsHover(false)
    }

    const handleNumberClick = (i: number) => {
        setIndex(i)
    }

    return (
        <div
            className={`${styles.counter} ${className}`}
            ref={containerRef}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
        >
            {isHover && (
                <div className={styles.counterHover}>
                    {data.map((video: any, i: number) => (
                        <div
                            key={i}
                            className={styles.counterHoverItem}
                            onClick={() => handleNumberClick(i)}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>
            )}
            {!isHover && <div ref={currentNumberRef}>{currentOrder}</div>}
            <span>/{numberOfVideos}</span>
        </div>
    )
}
