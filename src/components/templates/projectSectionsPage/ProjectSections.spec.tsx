import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProjectSections from './ProjectSections'

jest.mock('@gsap/react', () => ({ useGSAP: jest.fn() }))
jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
jest.mock('../../../i18n/routing', () => ({
    Link: ({
        href,
        ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a href={href} {...props} />
    ),
}))

describe('Project sections', () => {
    it('links to the commercials, music videos and stills lists', () => {
        render(<ProjectSections />)

        expect(
            screen.getByRole('link', { name: 'commercials' })
        ).toHaveAttribute('href', '/projects/commercials')
        expect(
            screen.getByRole('link', { name: 'musicVideos' })
        ).toHaveAttribute('href', '/projects/music-videos')
        expect(
            screen.getByRole('link', { name: 'stills' })
        ).toHaveAttribute('href', '/projects/photography')
    })
})
