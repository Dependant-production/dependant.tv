import Director from '@/components/templates/directorsPage/Directors'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Director',
}

export default function DirectorsPage() {
    return <Director />
}
