/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchStrapi } from '@/helpers/fetchStrapi'
import ProjectDetails from '@/components/templates/projectDetails/ProjectDetails'

type tParamsSlug = Promise<{
    locale: string
    slug: string
    projectSlug: string
}>
export default async function ProjectDetailPage(props: {
    params: tParamsSlug
}) {
    const { slug, projectSlug } = await props.params

    try {
        const formattedSlug = slug.replace(/%20/g, '-')
        const proSlug = projectSlug.replace(/%20/g, '-').toLowerCase()

        const response = await fetchStrapi<any[]>(
            `/api/photographers?filters[slug][$eq]=${formattedSlug}&filters[projects][projectSlug][$eq]=${proSlug}&populate=projects.media`
        )

        const projectsData = response?.data[0]
        const projectDetails = projectsData.projects.find(
            (project: ProjectType) => project.projectSlug === projectSlug
        )
        return (
            <ProjectDetails
                projectDetails={projectDetails}
                photographerName={projectsData.name}
            />
        )
    } catch (error) {
        console.error('Error fetching data from strapi:', error)
        return null
    }
}
