import React from 'react'
import styles from './CounterVideo.module.scss'

interface CounterVideoProps {
    numberOfVideos: number
    currentIndex: number
}

export default function CounterVideo({
    numberOfVideos,
    currentIndex,
}: CounterVideoProps) {
    console.log('currentIndex dans CounterVideo', currentIndex)
    return (
        <div className={styles.counterContainer}>
            {Array.from({ length: numberOfVideos }).map((_, index) => {
                console.log('index', index)
                return (
                    <span
                        key={index}
                        className={`${styles.round} ${
                            index === currentIndex ? styles.active : ''
                        }`}
                    />
                )
            })}
        </div>
    )
}
