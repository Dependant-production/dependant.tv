import Directors from '@/components/templates/directorsPage/Directors'
import axiosInstance from '@/helpers/axiosInstance'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Directors',
}

export default async function DirectorsPage(props: { params: tParams }) {
    const { locale } = await props.params

    try {
        const response = await axiosInstance.get(
            `/api/directors?locale=${locale}&populate=coverVideo`
        )
        if (
            !response.data ||
            !response.data.data ||
            response.data.data.length === 0
        ) {
            notFound()
        }

        const directorsData = response?.data?.data
        return <Directors directorsData={directorsData} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
    }
}
