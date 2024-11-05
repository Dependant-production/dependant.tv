import Projects from '@/components/templates/projectsPage/Projects'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Photographer',
}

export default function ProjectsPage() {
    return <Projects />
}
