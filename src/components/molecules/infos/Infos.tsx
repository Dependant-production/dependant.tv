'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslations } from 'next-intl'
import React from 'react'
import styles from './Infos.module.scss'
import { Link } from '@/i18n/routing'

export default function Infos() {
    const t = useTranslations()

    return (
        <div className={styles.infos}>
            <div className={styles.container}>
                <h3 className={styles.infosTitle}>
                    {t('Contact.Infos.title')}
                </h3>
                <Link href="">@dependant.tv</Link>
                <Link href="">mail</Link>
                <p>addrress</p>
            </div>
            <div className={styles.container}>
                <h3 className={styles.infosTitle}>
                    {t('Contact.Infos.titleServices')}
                </h3>
                <div className={styles.infosContainer}>
                    <p>{t('Contact.Infos.advertising')}</p>
                    <p>{t('Contact.Infos.clip')}</p>
                    <p>{t('Contact.Infos.brand')}</p>
                    <p>{t('Contact.Infos.print')}</p>
                </div>
            </div>
            <div className={styles.container}>
                <h3 className={styles.infosTitle}>
                    {t('Contact.Infos.titleCredits')}
                </h3>
                <div className={styles.infosContainer}>
                    <p>{t('Contact.Infos.designed')}</p>
                    <p>{t('Contact.Infos.designer')}</p>
                    <p>{t('Contact.Infos.developed')}</p>
                    <p>{t('Contact.Infos.developer')}</p>
                </div>
            </div>
        </div>
    )
}
