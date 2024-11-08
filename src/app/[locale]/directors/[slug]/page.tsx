/* eslint-disable @typescript-eslint/no-explicit-any */
import DirectorDetails from '@/components/templates/directorDetails/DirectorDetails'
import client from '@/utils/contentful'

async function fetchDirectorData(slug: string) {
    try {
        const formattedSlug = slug.replace(/%20/g, '-')

        const response = await client.getEntries({
            content_type: 'directorsProjects',
            'fields.directorName.sys.contentType.sys.id': 'directors',
            'fields.directorName.fields.slug': formattedSlug,
        })

        if (response.items.length > 0) {
            return response.items[0]
        } else {
            return null
        }
    } catch (error) {
        console.error('Error fetching data from Contentful:', error)
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
