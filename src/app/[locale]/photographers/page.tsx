import Projects from '@/components/templates/photographersPage/Photographers'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Photographer',
}

export default function PhotographerPage() {
    return <Projects />
}
