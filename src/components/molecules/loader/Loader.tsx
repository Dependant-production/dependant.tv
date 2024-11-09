'use client'
import Image from 'next/image'
import React from 'react'
import styles from './Loader.module.scss'

export default function Loader() {
    return (
        <main className={styles.loader}>
            <Image
                src="/logoDpdBlack.png"
                alt="loader"
                width={300}
                height={100}
            />
        </main>
    )
}
