/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import styles from './DirectorDetails.module.scss'

export default function DirectorDetails({ directorData }: any) {
    return (
        <main className={styles.directorDetails}>
            <h1>{directorData[0]?.name}</h1>
        </main>
    )
}
