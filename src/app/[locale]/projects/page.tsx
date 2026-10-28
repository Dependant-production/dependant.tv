import type { Metadata } from 'next'
import Projects from '@/components/templates/projectsPage/Projects'
import { getProjects } from '@/helpers/projects'

export const metadata: Metadata = {
    title: 'Projects',
}

export default async function ProjectsPage(props: { params: tParams }) {
    const { locale } = await props.params
    const projects = await getProjects(locale)

    return <Projects projects={projects} />
}
