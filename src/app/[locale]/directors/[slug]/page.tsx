import DirectorDetails from '@/components/templates/directorDetails/DirectorDetails'
import axiosInstance from '@/helpers/axiosInstance'

type tParamsSlug = Promise<{ locale: string; slug: string }>
export default async function DirectorsPage(props: { params: tParamsSlug }) {
    const { slug, locale } = await props.params

    try {
        const formattedSlug = slug.replace(/%20/g, '-').toLowerCase()

        const response = await axiosInstance.get(
            `/api/directors?filters[slug][$eq]=${formattedSlug}&locale=${locale}&populate=videos.url&populate=photographer`
        )

        const directorData = response?.data?.data
        return <DirectorDetails directorData={directorData} />
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}
