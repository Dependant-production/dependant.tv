import type { Metadata } from 'next'
import ProjectSections from '@/components/templates/projectSectionsPage/ProjectSections'

export const metadata: Metadata = {
    title: 'Projects',
}

export default function ProjectsPage() {
    return <ProjectSections />
}
