import React from 'react'
import Infos from '@/components/molecules/infos/Infos'
import styles from './Contact.module.scss'

interface ContactProps {
    contactData: {
        id: number
        documentId: string
        instagram: string
        mail: string
        address: string
        createdAt: string
        updatedAt: string
        publishedAt: string
    }
}

export default function Contact({ contactData }: ContactProps) {
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
