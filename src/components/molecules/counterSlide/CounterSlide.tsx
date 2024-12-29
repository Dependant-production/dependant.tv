/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

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
    const numberOfVideos = data.length
    if (numberOfVideos === 0 || index < 0 || index >= numberOfVideos) {
        return null
    }
    const currentVideo = data[index]
    const actualVideoOrder = currentVideo.order

    return (
        <div className={className}>
            {actualVideoOrder}/{numberOfVideos}
        </div>
    )
}
