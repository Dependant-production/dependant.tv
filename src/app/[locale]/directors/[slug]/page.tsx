/* eslint-disable @typescript-eslint/no-explicit-any */
import DirectorDetails from '@/components/templates/directorDetails/DirectorDetails'
import axiosInstance from '@/helpers/axiosInstance'

async function fetchDirectorData(slug: string) {
    try {
        const formattedSlug = slug.replace(/%20/g, '-')
        console.log('formattedSlug', formattedSlug)

        const response = await axiosInstance.get('/director')

        console.log('response', response)
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}

export default async function DirectorPage({ params }: any) {
    const { slug } = params

    const directorData = await fetchDirectorData(slug)

    if (!directorData) {
        return (
            <div>
                <h1>Le réalisateur n&apos;a pas été trouvé.</h1>
            </div>
        )
    }

    return <DirectorDetails directorData={directorData} />
}
