/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Contact from '@/components/templates/contactPage/Contact'
import { fetchStrapi } from '@/helpers/fetchStrapi'

export const metadata: Metadata = {
    title: 'Contact',
}

export default async function ContactPage(props: { params: tParams }) {
    const { locale } = await props.params

    try {
        const response = await fetchStrapi<any[]>(
            `/api/contact?locale=${locale}&populate=*`
        )
        if (!response.data || response.data.length === 0) {
            notFound()
        }
        const contactData = response?.data
        return <Contact contactData={contactData as any} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
    }
}
