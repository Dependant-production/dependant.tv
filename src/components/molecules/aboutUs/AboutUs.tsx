'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useTranslations } from 'next-intl'
import styles from './AboutUs.module.scss'

export default function AboutUs() {
    const t = useTranslations()
    return (
        <>
            <h3 className={styles.aboutUsTitle}>
                {t('Contact.AboutUs.title')}
            </h3>
            <p className={styles.aboutUsDesc}></p>
        </>
    )
}
