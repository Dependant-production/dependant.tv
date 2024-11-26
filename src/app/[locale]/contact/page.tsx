import Contact from '@/components/templates/contactPage/Contact'
import axiosInstance from '@/helpers/axiosInstance'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Contact',
}

export default async function ContactPage(props: { params: tParams }) {
    const { locale } = await props.params

    try {
        const response = await axiosInstance.get(
            `/api/contact?locale=${locale}&populate=*`
        )
        if (
            !response.data ||
            !response.data.data ||
            response.data.data.length === 0
        ) {
            notFound()
        }
        const contactData = response?.data?.data
        return <Contact contactData={contactData} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
    }
}
