import { fetchStrapi } from './fetchStrapi'
import { getPhotoProject, getProjects, getVideoProject } from './projects'

jest.mock('./fetchStrapi')

const mockFetchStrapi = jest.mocked(fetchStrapi)

describe('project catalog', () => {
    beforeEach(() => {
        mockFetchStrapi.mockReset()
    })

    it('lists selected photo and video projects without duplicating shared projects or merging equal titles', async () => {
        const sharedPhoto = {
            documentId: 'shared-photo',
            title: 'Alpha',
            showInProjects: true,
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
                        showInProjects: true,
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
                        showInProjects: true,
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
                        showInProjects: true,
                        mux_video_uploader_mux_assets: [
                            { id: 6, playback_id: 'duplicate-video' },
                        ],
                    },
                    {
                        documentId: 'no-assets',
                        title: 'Bravo',
                        showInProjects: true,
                    },
                    {
                        documentId: 'pending-assets',
                        title: 'Charlie',
                        showInProjects: true,
                        mux_video_uploader_mux_assets: [
                            { id: 4, playback_id: null },
                            { id: 5, playback_id: '' },
                        ],
                    },
                ],
            })

        const projects = await getProjects('fr')

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
            const query = new URL(endpoint, 'https://cms.example').searchParams
            const page = Number(query.get('pagination[page]'))
            const isPhoto = endpoint.startsWith('/api/projects?')
            const pageCount = isPhoto ? 3 : 2
            const prefix = isPhoto ? 'photo' : 'video'
            const project = {
                documentId: `${prefix}-${page}`,
                title: `${prefix} ${page}`,
                showInProjects: true,
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

        const projects = await getProjects('en')

        expect(projects.map(({ documentId }) => documentId).sort()).toEqual([
            'photo-1',
            'photo-2',
            'photo-3',
            'video-1',
            'video-2',
        ])
        expect(mockFetchStrapi).toHaveBeenCalledTimes(5)
        expect(
            mockFetchStrapi.mock.calls.every(
                ([endpoint]) =>
                    (endpoint.startsWith('/api/projects?') ||
                        endpoint.startsWith('/api/project-videos?')) &&
                    endpoint.includes('filters[showInProjects][$eq]=true')
            )
        ).toBe(true)
    })

    it('requires the checkbox to be explicitly true for both photo and video projects', async () => {
        const hiddenProjects = [false, null, undefined].map((flag, index) => ({
            documentId: `hidden-${index}`,
            title: `Hidden project ${index}`,
            ...(flag === undefined ? {} : { showInProjects: flag }),
            mux_video_uploader_mux_assets: [
                { id: index, playback_id: `playable-${index}` },
            ],
        }))
        mockFetchStrapi
            .mockResolvedValueOnce({
                data: [
                    ...hiddenProjects,
                    {
                        documentId: 'selected-photo',
                        title: 'Photo',
                        showInProjects: true,
                    },
                ],
            })
            .mockResolvedValueOnce({
                data: [
                    ...hiddenProjects,
                    {
                        documentId: 'selected-video',
                        title: 'Video',
                        showInProjects: true,
                        mux_video_uploader_mux_assets: [
                            { id: 4, playback_id: 'playable-selected' },
                        ],
                    },
                ],
            })

        const projects = await getProjects('fr')

        expect(projects.map(({ documentId }) => documentId)).toEqual([
            'selected-photo',
            'selected-video',
        ])
    })

    it('includes selected photo and video projects hidden from artist portfolios while excluding unchecked projects', async () => {
        const projects = [
            {
                documentId: 'projects-only',
                title: 'Projects only',
                showInProjects: true,
                showInArtistPortfolio: false,
                mux_video_uploader_mux_assets: [
                    { id: 1, playback_id: 'projects-only-video' },
                ],
            },
            {
                documentId: 'hidden-everywhere',
                title: 'Hidden everywhere',
                showInProjects: false,
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

        const catalog = await getProjects('fr')

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
                showInProjects: true,
            },
            {
                documentId: 'photo-first-tie',
                title: 'Zulu',
                projectsOrder: 1,
                showInProjects: true,
            },
            {
                documentId: 'photo-default-order',
                title: 'Bravo',
                showInProjects: true,
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
            showInProjects: true,
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

        const projects = await getProjects('fr')

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
            showInProjects: true,
            showInArtistPortfolio: false,
            director: null,
            directorName: 'Lea esmaili',
            mux_video_uploader_mux_assets: [
                { id: index, playback_id: `playable-${index}` },
            ],
        }))
        const originalVideos = JSON.stringify(videos)
        mockFetchStrapi.mockImplementation((async (endpoint: string) => ({
            data: endpoint.startsWith('/api/projects?') ? [] : videos,
        })) as typeof fetchStrapi)

        const catalog = await getProjects('fr')

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
            showInProjects: true,
            showInArtistPortfolio: false,
            photographerName: 'Lea esmaili',
            coverMedia: { url: '/cover.jpg', mime: 'image/jpeg' },
            media: [{ url: '/gallery.jpg' }],
        }
        mockFetchStrapi.mockImplementation((async (endpoint: string) => ({
            data: endpoint.startsWith('/api/projects?') ? [photo] : [],
        })) as typeof fetchStrapi)

        await expect(getProjects('fr')).resolves.toEqual([
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
                showInProjects: true,
                ...credit,
                mux_video_uploader_mux_assets: [
                    { id: 1, playback_id: 'selected-playback' },
                ],
            }
            mockFetchStrapi
                .mockResolvedValueOnce({ data: [] })
                .mockResolvedValue({ data: [video] })

            await expect(getProjects('fr')).resolves.toEqual([
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

    it('returns an empty catalog when neither collection contains projects', async () => {
        mockFetchStrapi.mockResolvedValue({ data: [] })

        await expect(getProjects('fr')).resolves.toEqual([])
    })

    it('surfaces a Strapi failure instead of returning an incomplete catalog', async () => {
        mockFetchStrapi
            .mockResolvedValueOnce({ data: [] })
            .mockRejectedValueOnce(new Error('Strapi unavailable'))

        await expect(getProjects('fr')).rejects.toThrow('Strapi unavailable')
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
            showInProjects: true,
            showInArtistPortfolio: false,
            photographerName: 'Photographer',
            media: [{ url: '/projects-only.jpg' }],
        }
        const video = {
            documentId: 'projects-only-video',
            title: 'Projects only video',
            director: { name: 'Director' },
            showInProjects: true,
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

    it('opens the exact photo gallery even when its listing checkbox is unchecked', async () => {
        const selected = {
            documentId: 'selected-photo',
            title: 'Selected project',
            showInProjects: false,
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

    it('opens an unchecked video project and its playable assets without changing the source', async () => {
        const playableAssets = [
            { id: 1, playback_id: 'first-video' },
            { id: 2, playback_id: 'second-video' },
        ]
        const selected = {
            documentId: 'selected-video',
            title: 'Selected video',
            director: { name: 'Selected director' },
            showInProjects: false,
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
