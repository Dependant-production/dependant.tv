import { notFound } from 'next/navigation'
import DirectorDetails from '@/components/templates/directorDetails/DirectorDetails'
import HomepageProject from '@/components/templates/homepageProject/HomepageProject'
import ProjectDetails from '@/components/templates/projectDetails/ProjectDetails'
import {
    getHomepageProject,
    getPhotoProject,
    getVideoProject,
} from '@/helpers/projects'

type ProjectParams = Promise<{
    locale: string
    type: string
    documentId: string
}>

export default async function ProjectPage(props: { params: ProjectParams }) {
    const { locale, type, documentId } = await props.params

    if (type === 'photos') {
        const details = await getPhotoProject(locale, documentId)
        if (!details) notFound()

        return (
            <ProjectDetails
                projectDetails={details.project}
                photographerName={details.photographerName}
            />
        )
    }

    if (type === 'videos') {
        const director = await getVideoProject(locale, documentId)
        if (!director) notFound()

        return <DirectorDetails directorData={[director]} />
    }

    if (type === 'homepage') {
        const project = await getHomepageProject(locale, documentId)
        if (!project) notFound()

        return <HomepageProject {...project} />
    }

    notFound()
}
