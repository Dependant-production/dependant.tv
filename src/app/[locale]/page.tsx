/* eslint-disable @typescript-eslint/no-explicit-any */
import Homepage from '@/components/templates/homepage/Homepage'
import { fetchStrapi } from '@/helpers/fetchStrapi'
import { notFound } from 'next/navigation'

export default async function Home() {
    try {
        const response = await fetchStrapi<any[]>(
            '/api/homepage-videos?populate=*'
        )
        if (!response.data || response.data.length === 0) {
            notFound()
        }

        const homepageData = response?.data
        return <Homepage homepageData={homepageData} />
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error)
        return <Homepage homepageData={[]} />
    }
}
