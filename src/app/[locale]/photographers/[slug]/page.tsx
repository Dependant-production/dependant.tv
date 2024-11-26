/* eslint-disable @typescript-eslint/no-explicit-any */
import PhotographerDetails from '@/components/templates/photographerDetails/PhotographerDetails'
import axiosInstance from '@/helpers/axiosInstance'

type tParamsSlug = Promise<{ locale: string; slug: string }>
export default async function PhotograophersPage(props: {
    params: tParamsSlug
}) {
    const { slug, locale } = await props.params

    try {
        const formattedSlug = slug.replace(/%20/g, '-')

        const response = await axiosInstance.get(
            `/api/photographers?filters[slug][$eq]=${formattedSlug}&locale=${locale}&populate=photos.url`
        )

        const photographerData = response?.data?.data
        return <PhotographerDetails photographerData={photographerData} />
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}
