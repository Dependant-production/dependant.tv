import { notFound } from 'next/navigation'
import DirectorsPage from '@/app/[locale]/directors/[slug]/page'
import PhotographersPage from '@/app/[locale]/photographers/[slug]/page'
import PhotoProjectPage from '@/app/[locale]/photographers/[slug]/[projectSlug]/page'
import { fetchStrapi } from './fetchStrapi'

jest.mock('./fetchStrapi')
jest.mock(
    '../components/templates/directorDetails/DirectorDetails',
    () => () => null
)
jest.mock(
    '../components/templates/photographerDetails/PhotographerDetails',
    () => () => null
)
jest.mock(
    '../components/templates/projectDetails/ProjectDetails',
    () => () => null
)
jest.mock('next/navigation', () => ({
    notFound: jest.fn(() => {
        throw new Error('NEXT_NOT_FOUND')
    }),
}))

const mockFetchStrapi = jest.mocked(fetchStrapi)
const artistParams = () => Promise.resolve({ locale: 'fr', slug: 'artist' })
const photoParams = () =>
    Promise.resolve({
        locale: 'fr',
        slug: 'artist',
        projectSlug: 'selected-project',
    })

describe('artist portfolio routes', () => {
    beforeEach(() => {
        mockFetchStrapi.mockReset()
    })

    it('hides projects-only videos from the director portfolio while retaining visible and legacy projects', async () => {
        const projects = [
            { documentId: 'legacy' },
            { documentId: 'visible', showInArtistPortfolio: true },
            { documentId: 'unset', showInArtistPortfolio: null },
            {
                documentId: 'projects-only',
                showInProjects: true,
                showInArtistPortfolio: false,
            },
        ]
        mockFetchStrapi.mockResolvedValue({
            data: [{ name: 'Director', project_videos: projects }],
        })

        const result = await DirectorsPage({ params: artistParams() })

        expect(result?.props.directorData[0].project_videos).toEqual(
            projects.slice(0, 3)
        )
        expect(projects).toHaveLength(4)
    })

    it('hides projects-only photos from the photographer portfolio without changing the source selection', async () => {
        const projects = [
            { documentId: 'legacy' },
            { documentId: 'visible', showInArtistPortfolio: true },
            { documentId: 'unset', showInArtistPortfolio: null },
            {
                documentId: 'projects-only',
                showInProjects: true,
                showInArtistPortfolio: false,
            },
        ]
        mockFetchStrapi.mockResolvedValue({
            data: [{ name: 'Photographer', projects }],
        })

        const result = await PhotographersPage({ params: artistParams() })

        expect(result?.props.photographerData[0].projects).toEqual(
            projects.slice(0, 3)
        )
        expect(projects).toHaveLength(4)
    })

    it.each([true, null, undefined])(
        'keeps the existing photo detail URL accessible when portfolio visibility is %s',
        async (showInArtistPortfolio) => {
            const project = {
                documentId: 'selected-photo',
                projectSlug: 'selected-project',
                showInArtistPortfolio,
            }
            mockFetchStrapi.mockResolvedValue({
                data: [{ name: 'Photographer', projects: [project] }],
            })

            const result = await PhotoProjectPage({ params: photoParams() })

            expect(result?.props.projectDetails).toEqual(project)
            expect(result?.props.photographerName).toBe('Photographer')
            expect(notFound).not.toHaveBeenCalled()
        }
    )

    it('returns 404 for a hidden project on its old photographer detail URL', async () => {
        mockFetchStrapi.mockResolvedValue({
            data: [
                {
                    name: 'Photographer',
                    projects: [
                        {
                            projectSlug: 'selected-project',
                            showInProjects: true,
                            showInArtistPortfolio: false,
                        },
                    ],
                },
            ],
        })

        await expect(
            PhotoProjectPage({ params: photoParams() })
        ).rejects.toThrow('NEXT_NOT_FOUND')
    })

    it('returns 404 when the photographer or selected photo project is absent', async () => {
        for (const data of [[], [{ name: 'Photographer', projects: [] }]]) {
            mockFetchStrapi.mockResolvedValue({ data })

            await expect(
                PhotoProjectPage({ params: photoParams() })
            ).rejects.toThrow('NEXT_NOT_FOUND')
        }
    })

    it('preserves the existing null response when Strapi is unavailable', async () => {
        mockFetchStrapi.mockRejectedValue(new Error('Strapi unavailable'))
        const errorLog = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        try {
            await expect(
                DirectorsPage({ params: artistParams() })
            ).resolves.toBeNull()
            await expect(
                PhotographersPage({ params: artistParams() })
            ).resolves.toBeNull()
            await expect(
                PhotoProjectPage({ params: photoParams() })
            ).resolves.toBeNull()
        } finally {
            errorLog.mockRestore()
        }
    })
})
