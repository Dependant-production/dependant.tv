import Photographers from '@/components/templates/photographersPage/Photographers'
import axiosInstance from '@/helpers/axiosInstance'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Photographers',
}

export default async function PhotographerPage(props: { params: tParams }) {
    const { locale } = await props.params

    try {
        const response = await axiosInstance.get(
            `/api/photographers?locale=${locale}&populate=photo`
        )
        if (
            !response.data ||
            !response.data.data ||
            response.data.data.length === 0
        ) {
            notFound()
        }

        const photographersData = response?.data?.data
        return <Photographers photographersData={photographersData} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
    }
}
