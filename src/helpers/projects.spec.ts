import { fetchStrapi } from './fetchStrapi'
import {
    getHomepageProject,
    getPhotoProject,
    getProjects,
    getProjectsBeforeMore,
    getVideoProject,
    isProjectSection,
} from './projects'

jest.mock('./fetchStrapi')

const mockFetchStrapi = jest.mocked(fetchStrapi)

describe('project catalog', () => {
    beforeEach(() => {
        mockFetchStrapi.mockReset()
        mockFetchStrapi.mockResolvedValue({ data: [] })
    })

    it('lists the photo and video projects of a section without duplicating shared projects or merging equal titles', async () => {
        const sharedPhoto = {
            documentId: 'shared-photo',
            title: 'Alpha',
            projectsSection: 'commercials',
            photographerName: 'Alice',
            coverMedia: { url: '/alpha.jpg', mime: 'image/jpeg' },
        }
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: [
                    sharedPhoto,
                    {
                        documentId: 'other-photo',
                        title: 'Alpha',
                        projectsSection: 'commercials',
                        photographerName: 'Alice',
                    },
                    { ...sharedPhoto, photographerName: 'Bob' },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    {
                        documentId: 'shared-photo',
                        title: 'Zulu',
                        director: { name: 'Carol' },
                        projectsSection: 'commercials',
                        mux_video_uploader_mux_assets: [
                            { id: 1, playback_id: null },
                            { id: 2, playback_id: 'playable-video' },
                            { id: 3, playback_id: 'second-video' },
                        ],
                    },
                    {
                        documentId: 'shared-photo',
                        title: 'Zulu',
                        director: { name: 'Other director' },
                        projectsSection: 'commercials',
                        mux_video_uploader_mux_assets: [
                            { id: 6, playback_id: 'duplicate-video' },
                        ],
                    },
                    {
                        documentId: 'no-assets',
                        title: 'Bravo',
                        projectsSection: 'commercials',
                    },
                    {
                        documentId: 'pending-assets',
                        title: 'Charlie',
                        projectsSection: 'commercials',
                        mux_video_uploader_mux_assets: [
                            { id: 4, playback_id: null },
                            { id: 5, playback_id: '' },
                        ],
                    },
                ],
            })

        const projects = await getProjects('fr', 'commercials')

        expect(projects.map(({ title }) => title)).toEqual([
            'Alpha',
            'Alpha',
            'Zulu',
        ])
        expect(
            projects.filter(
                ({ documentId, category }) =>
                    documentId === 'shared-photo' && category === 'photos'
            )
        ).toHaveLength(1)
        expect(projects[0]).toMatchObject({
            creatorName: 'Alice',
            coverUrl: '/alpha.jpg',
            coverMime: 'image/jpeg',
        })
        expect(projects[1]).toMatchObject({ documentId: 'other-photo' })
        expect(projects[1].coverUrl).toBeUndefined()
        expect(projects[2]).toMatchObject({
            category: 'videos',
            documentId: 'shared-photo',
            creatorName: 'Carol',
            playbackId: 'playable-video',
        })
    })

    it('includes projects from every page of both Strapi collections', async () => {
        mockFetchStrapi.mockImplementation((async (endpoint: string) => {
            if (endpoint.startsWith('/api/homepage-videos?')) {
                return { data: [] }
            }

            const query = new URL(endpoint, 'https://cms.example').searchParams
            const page = Number(query.get('pagination[page]'))
            const isPhoto = endpoint.startsWith('/api/projects?')
            const pageCount = isPhoto ? 3 : 2
            const prefix = isPhoto ? 'photo' : 'video'
            const project = {
                documentId: `${prefix}-${page}`,
                title: `${prefix} ${page}`,
                projectsSection: 'commercials',
                mux_video_uploader_mux_assets: [
                    { id: page, playback_id: `playable-${page}` },
                ],
            }

            return {
                data: [
                    isPhoto
                        ? { ...project, photographerName: `Artist ${page}` }
                        : {
                              ...project,
                              director: { name: `Artist ${page}` },
                          },
                ],
                meta: {
                    pagination: {
                        page,
                        pageSize: 1,
                        pageCount,
                        total: pageCount,
                    },
                },
            }
        }) as typeof fetchStrapi)

        const projects = await getProjects('en', 'commercials')

        expect(projects.map(({ documentId }) => documentId).sort()).toEqual([
            'photo-1',
            'photo-2',
            'photo-3',
            'video-1',
            'video-2',
        ])
        expect(mockFetchStrapi).toHaveBeenCalledTimes(6)
        expect(
            mockFetchStrapi.mock.calls.every(
                ([endpoint]) =>
                    (endpoint.startsWith('/api/projects?') ||
                        endpoint.startsWith('/api/project-videos?') ||
                        endpoint.startsWith('/api/homepage-videos?')) &&
                    endpoint.includes(
                        'filters[projectsSection][$eq]=commercials'
                    )
            )
        ).toBe(true)
    })

    it('keeps only the requested section for both photo and video projects', async () => {
        const hiddenProjects = ['music-videos', null, undefined].map(
            (section, index) => ({
                documentId: `hidden-${index}`,
                title: `Hidden project ${index}`,
                ...(section === undefined ? {} : { projectsSection: section }),
                mux_video_uploader_mux_assets: [
                    { id: index, playback_id: `playable-${index}` },
                ],
            })
        )
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: [
                    ...hiddenProjects,
                    {
                        documentId: 'selected-photo',
                        title: 'Photo',
                        projectsSection: 'commercials',
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    ...hiddenProjects,
                    {
                        documentId: 'selected-video',
                        title: 'Video',
                        projectsSection: 'commercials',
                        mux_video_uploader_mux_assets: [
                            { id: 4, playback_id: 'playable-selected' },
                        ],
                    },
                ],
            })

        const projects = await getProjects('fr', 'commercials')

        expect(projects.map(({ documentId }) => documentId)).toEqual([
            'selected-photo',
            'selected-video',
        ])
    })

    it('includes photo and video projects hidden from artist portfolios while excluding projects without a section', async () => {
        const projects = [
            {
                documentId: 'projects-only',
                title: 'Projects only',
                projectsSection: 'commercials',
                showInArtistPortfolio: false,
                mux_video_uploader_mux_assets: [
                    { id: 1, playback_id: 'projects-only-video' },
                ],
            },
            {
                documentId: 'hidden-everywhere',
                title: 'Hidden everywhere',
                projectsSection: null,
                showInArtistPortfolio: false,
                mux_video_uploader_mux_assets: [
                    { id: 2, playback_id: 'hidden-video' },
                ],
            },
        ]
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: projects.map((project) => ({
                    ...project,
                    photographerName: 'Photographer',
                })),
            })
            .mockResolvedValueOnce({
                data: projects.map((project) => ({
                    ...project,
                    director: { name: 'Director' },
                })),
            })

        const catalog = await getProjects('fr', 'commercials')

        expect(catalog).toHaveLength(2)
        expect(catalog).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    documentId: 'projects-only',
                    category: 'photos',
                    creatorName: 'Photographer',
                }),
                expect.objectContaining({
                    documentId: 'projects-only',
                    category: 'videos',
                    creatorName: 'Director',
                    playbackId: 'projects-only-video',
                }),
            ])
        )
    })

    it('lists ordered projects first across both media types, then the unordered ones alphabetically, without changing the source arrays', async () => {
        const photoProjects = [
            {
                documentId: 'photo-third',
                title: 'Able',
                projectsOrder: 3,
                projectsSection: 'commercials',
            },
            {
                documentId: 'photo-first-tie',
                title: 'Zulu',
                projectsOrder: 1,
                projectsSection: 'commercials',
            },
            {
                documentId: 'photo-default-order',
                title: 'Bravo',
                projectsSection: 'commercials',
            },
        ]
        const videoProjects = [
            { documentId: 'video-third', title: 'Romeo', projectsOrder: 3 },
            { documentId: 'video-first', title: 'Alpha', projectsOrder: 1 },
            { documentId: 'video-second', title: 'Zulu', projectsOrder: 2 },
            {
                documentId: 'video-null-order',
                title: 'Alpha',
                projectsOrder: null,
            },
            {
                documentId: 'video-zero-order',
                title: 'Charlie',
                projectsOrder: 0,
            },
        ].map((project, index) => ({
            ...project,
            projectsSection: 'commercials',
            mux_video_uploader_mux_assets: [
                { id: index, playback_id: `playable-${index}` },
            ],
        }))
        const originalPhotoProjects = JSON.stringify(photoProjects)
        const originalVideoProjects = JSON.stringify(videoProjects)
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: photoProjects,
            })
            .mockResolvedValueOnce({
                data: videoProjects,
            })

        const projects = await getProjects('fr', 'commercials')

        expect(projects.map(({ documentId }) => documentId)).toEqual([
            'video-first',
            'photo-first-tie',
            'video-second',
            'photo-third',
            'video-third',
            'video-null-order',
            'photo-default-order',
            'video-zero-order',
        ])
        expect(JSON.stringify(photoProjects)).toBe(originalPhotoProjects)
        expect(JSON.stringify(videoProjects)).toBe(originalVideoProjects)
    })

    it('lists and opens all selected videos whose director remains unpublished, preserving their credits and selection', async () => {
        const videos = [
            {
                documentId: 'uos7g7cu63dkw0afhgdtn7mq',
                title: "Arsenal Kit 25/26 - Director's Cut",
                projectsOrder: 3,
            },
            {
                documentId: 'q93o014l1ek08mqkzcqelak5',
                title: 'Ashnikko - Trinkets',
                projectsOrder: 2,
            },
            {
                documentId: 'n9d6alvx2qlgvu8u3ghmfbz2',
                title: 'CRYSTALLMESS - THE FACE MAGAZINE x NIKE',
                projectsOrder: 0,
            },
            {
                documentId: 'nhfxa9j4no6irvdx8fe5owaa',
                title: 'CAMPAIGN THEODORA X VINTED',
                projectsOrder: 0,
            },
        ].map((video, index) => ({
            ...video,
            projectsSection: 'commercials',
            showInArtistPortfolio: false,
            director: null,
            directorName: 'Lea esmaili',
            mux_video_uploader_mux_assets: [
                { id: index, playback_id: `playable-${index}` },
            ],
        }))
        const originalVideos = JSON.stringify(videos)
        mockFetchStrapi.mockImplementation((async (endpoint: string) => ({
            data: endpoint.startsWith('/api/project-videos?') ? videos : [],
        })) as typeof fetchStrapi)

        const catalog = await getProjects('fr', 'commercials')

        expect(catalog.map(({ title }) => title)).toEqual([
            'Ashnikko - Trinkets',
            "Arsenal Kit 25/26 - Director's Cut",
            'CAMPAIGN THEODORA X VINTED',
            'CRYSTALLMESS - THE FACE MAGAZINE x NIKE',
        ])
        expect(
            catalog.every(({ creatorName }) => creatorName === 'Lea esmaili')
        ).toBe(true)
        for (const video of videos) {
            await expect(
                getVideoProject('fr', video.documentId)
            ).resolves.toEqual({
                name: 'Lea esmaili',
                project_videos: [video],
            })
            expect(mockFetchStrapi).toHaveBeenLastCalledWith(
                expect.stringContaining(
                    `/api/project-videos?locale=fr&filters[documentId][$eq]=${video.documentId}`
                ),
                expect.any(Object)
            )
        }
        expect(JSON.stringify(videos)).toBe(originalVideos)
    })

    it('lists and opens selected photos whose photographer remains unpublished', async () => {
        const photo = {
            documentId: 'draft-photographer-photo',
            title: 'THEODORA - MEGA BBL',
            projectsSection: 'commercials',
            showInArtistPortfolio: false,
            photographerName: 'Lea esmaili',
            coverMedia: { url: '/cover.jpg', mime: 'image/jpeg' },
            media: [{ url: '/gallery.jpg' }],
        }
        mockFetchStrapi.mockImplementation((async (endpoint: string) => ({
            data: endpoint.startsWith('/api/projects?') ? [photo] : [],
        })) as typeof fetchStrapi)

        await expect(getProjects('fr', 'commercials')).resolves.toEqual([
            expect.objectContaining({
                documentId: 'draft-photographer-photo',
                category: 'photos',
                creatorName: 'Lea esmaili',
                coverUrl: '/cover.jpg',
            }),
        ])
        await expect(
            getPhotoProject('fr', 'draft-photographer-photo')
        ).resolves.toEqual({ project: photo, photographerName: 'Lea esmaili' })
        expect(mockFetchStrapi).toHaveBeenLastCalledWith(
            expect.stringContaining(
                '/api/projects?locale=fr&filters[documentId][$eq]=draft-photographer-photo'
            ),
            expect.any(Object)
        )
    })

    it.each([
        {
            label: 'the published director name ahead of the fallback',
            credit: {
                director: { name: 'Published director' },
                directorName: 'Fallback director',
            },
            expectedName: 'Published director',
        },
        {
            label: 'the fallback when the published name is empty',
            credit: {
                director: { name: '' },
                directorName: 'Fallback director',
            },
            expectedName: 'Fallback director',
        },
        {
            label: 'an empty credit when the director and fallback are null',
            credit: { director: null, directorName: null },
            expectedName: '',
        },
        {
            label: 'an empty credit when both artist fields are missing',
            credit: {},
            expectedName: '',
        },
    ])(
        'keeps selected videos available with $label',
        async ({ credit, expectedName }) => {
            const video = {
                documentId: 'selected-video',
                title: 'Selected video',
                projectsSection: 'commercials',
                ...credit,
                mux_video_uploader_mux_assets: [
                    { id: 1, playback_id: 'selected-playback' },
                ],
            }
            mockFetchStrapi
                .mockResolvedValueOnce({ data: [] })
                .mockResolvedValue({ data: [video] })

            await expect(getProjects('fr', 'commercials')).resolves.toEqual([
                expect.objectContaining({
                    documentId: 'selected-video',
                    category: 'videos',
                    creatorName: expectedName,
                    playbackId: 'selected-playback',
                }),
            ])
            await expect(
                getVideoProject('fr', 'selected-video')
            ).resolves.toEqual({
                name: expectedName,
                project_videos: [video],
            })
        }
    )

    it('lists homepage videos of the section with their file as preview, ordered with the other projects', async () => {
        const homepageVideo = {
            documentId: 'homepage-video',
            title: 'Lacoste',
            projectsSection: 'commercials',
            projectsOrder: 1,
            director: { name: 'Raphael' },
            url: [{ url: '/lacoste.mp4', mime: 'video/mp4' }],
        }
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: [
                    {
                        documentId: 'photo',
                        title: 'Adidas',
                        projectsSection: 'commercials',
                    },
                ],
            })
            .mockResolvedValueOnce({ data: [] })
            .mockResolvedValueOnce({
                data: [
                    { ...homepageVideo },
                    homepageVideo,
                    {
                        ...homepageVideo,
                        documentId: 'other-section',
                        projectsSection: 'music-videos',
                    },
                    { ...homepageVideo, documentId: 'no-file', url: [] },
                ],
            })

        const projects = await getProjects('fr', 'commercials')

        expect(projects.map(({ documentId }) => documentId)).toEqual([
            'homepage-video',
            'photo',
        ])
        expect(projects[0]).toMatchObject({
            category: 'homepage',
            creatorName: 'Raphael',
            coverUrl: '/lacoste.mp4',
            coverMime: 'video/mp4',
        })
        expect(mockFetchStrapi).toHaveBeenCalledWith(
            expect.stringContaining(
                '/api/homepage-videos?locale=fr&filters[projectsSection][$eq]=commercials'
            ),
            expect.any(Object)
        )
    })

    it.each([
        {
            label: 'the director',
            credit: {
                director: { name: 'Director' },
                directorName: 'Draft',
                directorNameBIS: 'Free text',
            },
            expectedName: 'Director',
        },
        {
            label: 'the director still in draft',
            credit: {
                director: null,
                directorName: 'Draft',
                directorNameBIS: 'Free text',
            },
            expectedName: 'Draft',
        },
        {
            label: 'the free text name',
            credit: {
                director: null,
                directorName: null,
                directorNameBIS: 'Free text',
            },
            expectedName: 'Free text',
        },
        { label: 'nobody', credit: {}, expectedName: '' },
    ])(
        'credits a homepage video to $label',
        async ({ credit, expectedName }) => {
            const video = {
                documentId: 'homepage-video',
                title: 'Lacoste',
                projectsSection: 'commercials',
                url: [{ url: '/lacoste.mp4', mime: 'video/mp4' }],
                ...credit,
            }
            mockFetchStrapi.mockImplementation((async (endpoint: string) => ({
                data: endpoint.startsWith('/api/homepage-videos?')
                    ? [video]
                    : [],
            })) as typeof fetchStrapi)

            await expect(getProjects('fr', 'commercials')).resolves.toEqual([
                expect.objectContaining({ creatorName: expectedName }),
            ])
            await expect(
                getHomepageProject('fr', 'homepage-video')
            ).resolves.toEqual({
                title: 'Lacoste',
                creatorName: expectedName,
                videoUrl: '/lacoste.mp4',
            })
        }
    )

    it('recognises only the four sections of the Projects tab', () => {
        expect(isProjectSection('commercials')).toBe(true)
        expect(isProjectSection('music-videos')).toBe(true)
        expect(isProjectSection('photography')).toBe(true)
        expect(isProjectSection('unscripted')).toBe(true)
        expect(isProjectSection('photos')).toBe(false)
    })

    it('returns an empty catalog when neither collection contains projects', async () => {
        mockFetchStrapi.mockResolvedValue({ data: [] })

        await expect(getProjects('fr', 'commercials')).resolves.toEqual([])
    })

    it('surfaces a Strapi failure instead of returning an incomplete catalog', async () => {
        mockFetchStrapi
            .mockResolvedValueOnce({ data: [] })
            .mockRejectedValueOnce(new Error('Strapi unavailable'))

        await expect(getProjects('fr', 'commercials')).rejects.toThrow(
            'Strapi unavailable'
        )
    })
})

describe('projects shown before "more"', () => {
    beforeEach(() => {
        mockFetchStrapi.mockReset()
    })

    it('reads the number set for each section', async () => {
        mockFetchStrapi.mockResolvedValue({
            data: {
                commercialsBeforeMore: 4,
                musicVideosBeforeMore: 6,
                photographyBeforeMore: 8,
                unscriptedBeforeMore: 10,
            },
        })

        await expect(getProjectsBeforeMore('commercials')).resolves.toBe(4)
        await expect(getProjectsBeforeMore('music-videos')).resolves.toBe(6)
        await expect(getProjectsBeforeMore('photography')).resolves.toBe(8)
        await expect(getProjectsBeforeMore('unscripted')).resolves.toBe(10)
        expect(mockFetchStrapi).toHaveBeenCalledWith('/api/projects-tab', {
            revalidate: 60,
            tags: ['projects', 'projects-tab'],
        })
    })

    it('shows the whole section when its number is empty or 0', async () => {
        mockFetchStrapi.mockResolvedValue({
            data: { commercialsBeforeMore: 0, musicVideosBeforeMore: null },
        })

        await expect(
            getProjectsBeforeMore('commercials')
        ).resolves.toBeUndefined()
        await expect(
            getProjectsBeforeMore('music-videos')
        ).resolves.toBeUndefined()
        await expect(
            getProjectsBeforeMore('photography')
        ).resolves.toBeUndefined()
    })

    it('shows the whole section while Strapi has no setting or cannot answer', async () => {
        mockFetchStrapi.mockRejectedValue(
            new Error('Strapi fetch error: 404 - Not Found')
        )

        await expect(
            getProjectsBeforeMore('commercials')
        ).resolves.toBeUndefined()
    })
})

describe('project selection', () => {
    beforeEach(() => {
        mockFetchStrapi.mockReset()
    })

    it('opens photo and video details for projects shown exclusively in the projects tab', async () => {
        const photo = {
            documentId: 'projects-only-photo',
            title: 'Projects only photo',
            projectsSection: 'commercials',
            showInArtistPortfolio: false,
            photographerName: 'Photographer',
            media: [{ url: '/projects-only.jpg' }],
        }
        const video = {
            documentId: 'projects-only-video',
            title: 'Projects only video',
            director: { name: 'Director' },
            projectsSection: 'commercials',
            showInArtistPortfolio: false,
            mux_video_uploader_mux_assets: [
                { id: 1, playback_id: 'projects-only-playback' },
            ],
        }
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: [photo],
            })
            .mockResolvedValueOnce({
                data: [video],
            })

        await expect(
            getPhotoProject('fr', 'projects-only-photo')
        ).resolves.toEqual({ project: photo, photographerName: 'Photographer' })
        await expect(
            getVideoProject('fr', 'projects-only-video')
        ).resolves.toMatchObject({
            name: 'Director',
            project_videos: [video],
        })
    })

    it('opens the exact photo gallery even when the project has no section', async () => {
        const selected = {
            documentId: 'selected-photo',
            title: 'Selected project',
            projectsSection: null,
            photographerName: 'Selected photographer',
            media: [{ url: '/selected.jpg' }],
        }
        mockFetchStrapi.mockResolvedValue({
            data: [
                {
                    documentId: 'different-photo',
                    title: 'Other project',
                    photographerName: 'Other photographer',
                },
                selected,
            ],
        })

        await expect(getPhotoProject('fr', 'selected-photo')).resolves.toEqual({
            project: selected,
            photographerName: 'Selected photographer',
        })
    })

    it('opens a video project without a section and its playable assets without changing the source', async () => {
        const playableAssets = [
            { id: 1, playback_id: 'first-video' },
            { id: 2, playback_id: 'second-video' },
        ]
        const selected = {
            documentId: 'selected-video',
            title: 'Selected video',
            director: { name: 'Selected director' },
            projectsSection: null,
            mux_video_uploader_mux_assets: [
                { id: 0, playback_id: null },
                playableAssets[0],
                { id: 3, playback_id: '' },
                playableAssets[1],
            ],
        }
        const videos = [
            { documentId: 'other-video', title: 'Other video' },
            selected,
        ]
        mockFetchStrapi.mockResolvedValue({
            data: videos,
        })

        const result = await getVideoProject('en', 'selected-video')

        expect(result).toMatchObject({
            name: 'Selected director',
            project_videos: [
                { ...selected, mux_video_uploader_mux_assets: playableAssets },
            ],
        })
        expect(result?.project_videos).toHaveLength(1)
        expect(videos).toHaveLength(2)
        expect(videos[1]).toBe(selected)
        expect(selected.mux_video_uploader_mux_assets).toHaveLength(4)
    })

    it('returns null when the selected video project has no playable media', async () => {
        for (const assets of [
            undefined,
            [],
            [
                { id: 1, playback_id: null },
                { id: 2, playback_id: '' },
            ],
        ]) {
            mockFetchStrapi.mockResolvedValue({
                data: [
                    {
                        documentId: 'pending-video',
                        title: 'Pending video',
                        mux_video_uploader_mux_assets: assets,
                    },
                ],
            })

            await expect(
                getVideoProject('fr', 'pending-video')
            ).resolves.toBeNull()
        }
    })

    it('returns null for a homepage video that is missing or has no file', async () => {
        mockFetchStrapi.mockResolvedValue({
            data: [{ documentId: 'no-file', title: 'No file', url: [] }],
        })

        await expect(getHomepageProject('fr', 'no-file')).resolves.toBeNull()
        await expect(getHomepageProject('fr', 'missing')).resolves.toBeNull()
    })

    it('returns null for missing photo or video projects', async () => {
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: [
                    {
                        documentId: 'other-photo',
                        photographerName: 'Other artist',
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [{ documentId: 'other-video' }],
            })

        await expect(getPhotoProject('fr', 'missing')).resolves.toBeNull()
        await expect(getVideoProject('fr', 'missing')).resolves.toBeNull()

        mockFetchStrapi.mockResolvedValue({ data: [] })

        await expect(getPhotoProject('fr', 'missing')).resolves.toBeNull()
        await expect(getVideoProject('fr', 'missing')).resolves.toBeNull()
    })
})
