import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Projects from '@/components/templates/projectsPage/Projects'
import {
    getProjects,
    getProjectsBeforeMore,
    isProjectSection,
} from '@/helpers/projects'

export const metadata: Metadata = {
    title: 'Projects',
}

type SectionParams = Promise<{ locale: string; type: string }>

export default async function ProjectSectionPage(props: {
    params: SectionParams
}) {
    const { locale, type } = await props.params
    if (!isProjectSection(type)) notFound()

    const [projects, beforeMore] = await Promise.all([
        getProjects(locale, type),
        getProjectsBeforeMore(type),
    ])

    // Keyed by section, so moving to another one starts with its short list.
    return <Projects key={type} projects={projects} beforeMore={beforeMore} />
}
