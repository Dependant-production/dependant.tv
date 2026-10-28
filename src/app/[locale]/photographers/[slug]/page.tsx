import PhotographerDetails from '@/components/templates/photographerDetails/PhotographerDetails'
import { fetchStrapi } from '@/helpers/fetchStrapi'

type tParamsSlug = Promise<{ locale: string; slug: string }>
export default async function PhotograophersPage(props: {
    params: tParamsSlug
}) {
    const { slug, locale } = await props.params

    try {
        const formattedSlug = slug.replace(/%20/g, '-').toLowerCase()

        const response = await fetchStrapi<PhotographerType[]>(
            `/api/photographers?filters[slug][$eq]=${formattedSlug}&locale=${locale}&populate=projects&populate=projects.coverMedia`,
            { revalidate: 60 }
        )

        const photographerData = response.data.map((photographer) => ({
            ...photographer,
            projects: photographer.projects?.filter(
                (project) => project.showInArtistPortfolio !== false
            ),
        }))
        return <PhotographerDetails photographerData={photographerData} />
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}
