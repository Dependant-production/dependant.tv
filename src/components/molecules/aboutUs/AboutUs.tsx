'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import styles from './AboutUs.module.scss'

interface AboutUsProps {
    desc: string
}

export default function AboutUs({ desc }: AboutUsProps) {
    const t = useTranslations()
    return (
        <>
            <h3 className={styles.aboutUsTitle}>
                {t('Contact.AboutUs.title')}
            </h3>
            <p className={styles.aboutUsDesc}>{desc}</p>
        </>
    )
}
