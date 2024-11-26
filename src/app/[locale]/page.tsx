import Homepage from '@/components/templates/homepage/Homepage'
import axiosInstance from '@/helpers/axiosInstance'
import { notFound } from 'next/navigation'

export default async function Home() {
    try {
        const response = await axiosInstance.get(
            '/api/homepage-videos?populate=*'
        )
        if (
            !response.data ||
            !response.data.data ||
            response.data.data.length === 0
        ) {
            notFound()
        }

        const homepageData = response?.data?.data
        console.log('homepageData', homepageData)
        return <Homepage homepageData={homepageData} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
    }
    return <Homepage />
}
