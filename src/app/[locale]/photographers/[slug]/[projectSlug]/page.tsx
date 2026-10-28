import { fetchStrapi } from '@/helpers/fetchStrapi'
import ProjectDetails from '@/components/templates/projectDetails/ProjectDetails'
import { notFound } from 'next/navigation'

type tParamsSlug = Promise<{
    locale: string
    slug: string
    projectSlug: string
}>
export default async function ProjectDetailPage(props: {
    params: tParamsSlug
}) {
    const { slug, projectSlug } = await props.params
    const formattedSlug = slug.replace(/%20/g, '-')
    const proSlug = projectSlug.replace(/%20/g, '-').toLowerCase()
    let photographer: PhotographerType | undefined

    try {
        const response = await fetchStrapi<PhotographerType[]>(
            `/api/photographers?filters[slug][$eq]=${formattedSlug}&filters[projects][projectSlug][$eq]=${proSlug}&populate=projects.media`,
            { revalidate: 60 }
        )
        photographer = response.data[0]
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }

    if (!photographer) notFound()

    const projectDetails = photographer.projects?.find(
        (project) => project.projectSlug === proSlug
    )
    if (!projectDetails || projectDetails.showInArtistPortfolio === false) {
        notFound()
    }

    return (
        <ProjectDetails
            projectDetails={projectDetails}
            photographerName={photographer.name}
        />
    )
}
