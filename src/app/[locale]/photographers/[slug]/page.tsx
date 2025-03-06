import axiosInstance from '@/helpers/axiosInstance'
import PhotographerDetails from '@/components/templates/photographerDetails/PhotographerDetails'

type tParamsSlug = Promise<{ locale: string; slug: string }>
export default async function PhotograophersPage(props: {
    params: tParamsSlug
}) {
    const { slug, locale } = await props.params

    try {
        const formattedSlug = slug.replace(/%20/g, '-').toLowerCase()

        const response = await axiosInstance.get(
            `/api/photographers?filters[slug][$eq]=${formattedSlug}&locale=${locale}&populate=projects&populate=projects.coverMedia`
        )

        const photographerData = response?.data?.data
        return <PhotographerDetails photographerData={photographerData} />
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}
