'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useTranslations } from 'next-intl'
import useContentful from '@/hooks/useContentful'
import styles from './AboutUs.module.scss'

export default function AboutUs() {
    const t = useTranslations()
    const contentful: { fields: any }[] = useContentful('infos')
    const data: any = contentful[0]?.fields || {}
    return (
        <>
            <h3 className={styles.aboutUsTitle}>
                {t('Contact.AboutUs.title')}
            </h3>
            <p className={styles.aboutUsDesc}>{data?.aboutUs}</p>
        </>
    )
}
