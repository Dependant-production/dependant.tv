// import { useTranslations } from 'next-intl'
import React from 'react'
import styles from './Directors.module.scss'

export default function Directors() {
    // const t = useTranslations()
    return (
        <main className={styles.directorContainer}>
            <section className={styles.textContainer}>
            <ul className={styles.nameContainer}>
                <li className={styles.name}>
                    Raphael de albuquerque
                </li>
                <li className={styles.name}>
                    lea esmaili
                </li>
                <li className={styles.name}>
                    antoine saab
                </li>
                <li className={styles.name}>
                    martin josserand
                </li>
            </ul>
            <div>
                <p>Name of the project</p>
            </div>
            </section>
        </main>
    )
}
