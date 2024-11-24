/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import Infos from '@/components/molecules/infos/Infos'
import AboutUs from '@/components/molecules/aboutUs/AboutUs'
import styles from './Contact.module.scss'
import axiosInstance from '@/helpers/axiosInstance'

export default function Contact() {
    const [infos, setInfos] = useState<any>([])

    useEffect(() => {
        const fetchInfosContact = async () => {
            try {
                const response = await axiosInstance.get('/contact?populate=*')
                const data = response.data?.data || []
                setInfos(data)
            } catch (error) {
                console.error(
                    'Erreur lors de la récupération des données :',
                    error
                )
            }
        }

        fetchInfosContact()
    }, [])
    const dataInfos = infos ?? []

    console.log('dataInfos', dataInfos)

    return (
        <main className={styles.contact}>
            <article className={styles.contactContainer}>
                <section className={styles.aboutUsContainer}>
                    <AboutUs desc="" />
                </section>
                <section className={styles.infosContainer}>
                    <Infos
                        insta={dataInfos?.instagram}
                        mail={dataInfos?.mail}
                        address={dataInfos?.address}
                    />
                </section>
            </article>
        </main>
    )
}
