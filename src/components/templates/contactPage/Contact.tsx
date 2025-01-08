/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Infos from '@/components/molecules/infos/Infos'
import styles from './Contact.module.scss'

export default function Contact({ contactData }: any) {
    return (
        <main className={styles.contact}>
            <Infos
                insta={contactData?.instagram}
                mail={contactData?.mail}
                address={contactData?.address}
            />
        </main>
    )
}
