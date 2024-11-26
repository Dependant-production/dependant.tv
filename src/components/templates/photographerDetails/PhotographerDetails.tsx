import React from 'react'
import styles from './PhotographerDetails.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PhotographerDetails({ photographerData }: any) {
    console.log('photographerData', photographerData)
    return (
        <main className={styles.photographerDetails}>
            <h1>{photographerData[0].name}</h1>
        </main>
    )
}
