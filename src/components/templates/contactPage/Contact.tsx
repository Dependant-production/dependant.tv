import React from 'react'
import { useTranslations } from 'next-intl'
import Infos from '@/components/molecules/infos/Infos'
import AboutUs from '@/components/molecules/aboutUs/AboutUs'
import styles from './Contact.module.scss'

export default function Contact() {
    const t = useTranslations()
    return (
        <main className={styles.contact}>
            <article className={styles.contactContainer}>
                <section className={styles.aboutUsContainer}>
                    <AboutUs />
                </section>
                <section className={styles.InfosContainer}>
                    <Infos />
                </section>
            </article>
        </main>
    )
}
