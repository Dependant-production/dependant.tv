/* eslint-disable @typescript-eslint/no-explicit-any */
import Photographers from '@/components/templates/photographersPage/Photographers'
import { fetchStrapi } from '@/helpers/fetchStrapi'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Photographers',
}

export default async function PhotographerPage(props: { params: tParams }) {
    const { locale } = await props.params

    try {
        const response = await fetchStrapi<any[]>(
            `/api/photographers?locale=${locale}&populate=photo`
        )
        if (!response.data || response.data.length === 0) {
            notFound()
        }

        const photographersData = response?.data
        return <Photographers photographersData={photographersData} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
    }
}
