import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Projects from './Projects'
import type { ProjectListItem } from '@/types/projects'

jest.mock('@gsap/react', () => ({ useGSAP: jest.fn() }))
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
jest.mock('@mux/mux-player-react', () => ({
    __esModule: true,
    default: ({ playbackId }: { playbackId: string }) => (
        <div data-testid="preview">{playbackId}</div>
    ),
}))
jest.mock('../../../i18n/routing', () => ({
    Link: ({
        href,
        ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a href={href} {...props} />
    ),
}))

const projects: ProjectListItem[] = [
    {
        documentId: 'first',
        category: 'videos',
        title: 'First project',
        creatorName: 'Alice',
        playbackId: 'first-video',
    },
    {
        documentId: 'second',
        category: 'videos',
        title: 'Second project',
        creatorName: 'Bob',
        playbackId: 'second-video',
    },
]

function setTouchScreen(isTouch: boolean) {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches: query === '(hover: none)' && isTouch,
        media: query,
    }))
}

describe('Projects list', () => {
    it('previews a project on the first tap of a touch screen and opens it on the second', () => {
        setTouchScreen(true)
        render(<Projects projects={projects} />)
        const second = screen.getByRole('link', { name: 'Second project' })

        // fireEvent returns false when the click was prevented.
        expect(fireEvent.click(second)).toBe(false)
        expect(screen.getByTestId('preview')).toHaveTextContent('second-video')
        expect(screen.getByText('Bob')).toBeInTheDocument()
        expect(second).toHaveClass('selected')

        expect(fireEvent.click(second)).toBe(true)
    })

    it('opens the project already in the preview on the first tap', () => {
        setTouchScreen(true)
        render(<Projects projects={projects} />)

        expect(
            fireEvent.click(screen.getByRole('link', { name: 'First project' }))
        ).toBe(true)
    })

    it('opens a project on the first click with a mouse', () => {
        setTouchScreen(false)
        render(<Projects projects={projects} />)

        expect(
            fireEvent.click(
                screen.getByRole('link', { name: 'Second project' })
            )
        ).toBe(true)
    })
})
