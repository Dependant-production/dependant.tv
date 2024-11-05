'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import useContentful from '@/hooks/useContentful'
import { useTranslations } from 'next-intl'
import React from 'react'
import styles from './Infos.module.scss'

export default function Infos() {
    const t = useTranslations()
    const contentful: { fields: any }[] = useContentful('infos')
    const data: any = contentful[0]?.fields || {}

    return (
        <div className={styles.infos}>
            <h3 className={styles.infosTitle}>{t('Contact.Infos.title')}</h3>
            <p>{data?.insta}</p>
            <p>{data?.mail}</p>
            <p>{data?.phoneNumbers}</p>
            <p>{data?.address}</p>
            <div>
                <h3 className={styles.infosTitle}>
                    {t('Contact.Infos.titleServices')}
                </h3>
                <p>{t('Contact.Infos.advertising')}</p>
                <p>{t('Contact.Infos.clip')}</p>
                <p>{t('Contact.Infos.brand')}</p>
                <p>{t('Contact.Infos.print')}</p>
            </div>
            <div>
                <h3 className={styles.infosTitle}>
                    {t('Contact.Infos.titleCredits')}
                </h3>
                <p>{t('Contact.Infos.designed')}</p>
                <p>{t('Contact.Infos.designer')}</p>
                <p>{t('Contact.Infos.developed')}</p>
                <p>{t('Contact.Infos.developer')}</p>
            </div>
        </div>
    )
}
