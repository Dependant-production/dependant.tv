/* eslint-disable @typescript-eslint/no-explicit-any */
import DirectorDetails from '@/components/templates/directorDetails/DirectorDetails'
import { fetchStrapi } from '@/helpers/fetchStrapi'

type tParamsSlug = Promise<{ locale: string; slug: string }>
export default async function DirectorsPage(props: { params: tParamsSlug }) {
    const { slug, locale } = await props.params

    try {
        const formattedSlug = slug.replace(/%20/g, '-').toLowerCase()

        const response = await fetchStrapi<any[]>(
            `/api/directors?filters[slug][$eq]=${formattedSlug}&locale=${locale}&populate=project_videos.mux_video_uploader_mux_assets`
        )

        const directorData = response?.data
        return <DirectorDetails directorData={directorData} />
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}
