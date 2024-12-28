/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Infos from '@/components/molecules/infos/Infos'
import AboutUs from '@/components/molecules/aboutUs/AboutUs'
import styles from './Contact.module.scss'

export default function Contact({ contactData }: any) {
    return (
        <main className={styles.contact}>
            <article className={styles.contactContainer}>
                <section className={styles.aboutUsContainer}>
                    <AboutUs desc="" />
                </section>
                <section className={styles.infosContainer}>
                    <Infos
                        insta={contactData?.instagram}
                        mail={contactData?.mail}
                        address={contactData?.address}
                    />
                </section>
            </article>
        </main>
    )
}
