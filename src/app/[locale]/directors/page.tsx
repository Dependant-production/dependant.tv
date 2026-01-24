/* eslint-disable @typescript-eslint/no-explicit-any */
import Directors from '@/components/templates/directorsPage/Directors'
import { fetchStrapi } from '@/helpers/fetchStrapi'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Directors',
}

export default async function DirectorsPage(props: { params: tParams }) {
    const { locale } = await props.params

    try {
        const response = await fetchStrapi<any[]>(
            `/api/directors?locale=${locale}&populate=coverVideo`,
            {
                revalidate: 3600, // Cache 1h
                tags: ['directors', `directors-${locale}`], // Pour revalidation ciblée
            }
        )
        if (!response.data || response.data.length === 0) {
            notFound()
        }

        const directorsData = response?.data
        return <Directors directorsData={directorsData} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
    }
}
