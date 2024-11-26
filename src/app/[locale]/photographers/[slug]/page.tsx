/* eslint-disable @typescript-eslint/no-explicit-any */
import DirectorDetails from '@/components/templates/directorDetails/DirectorDetails'
import axiosInstance from '@/helpers/axiosInstance'

async function fetchPhotographerData(slug: string) {
    try {
        const formattedSlug = slug.replace(/%20/g, '-')
        console.log('formattedSlug', formattedSlug)

        const response = await axiosInstance.get('/photographer')

        console.log('response', response)
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}

export default async function PhotograophersPage({ params }: any) {
    const { slug } = params

    const photographerData = await fetchPhotographerData(slug)

    if (!photographerData) {
        return (
            <div>
                <h1>Le réalisateur n&apos;a pas été trouvé.</h1>
            </div>
        )
    }

    return <DirectorDetails directorData={photographerData} />
}
