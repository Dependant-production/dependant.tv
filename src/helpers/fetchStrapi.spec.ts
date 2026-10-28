import { fetchStrapi } from './fetchStrapi'

const mockFetch = jest.fn()
const originalFetch = global.fetch
const originalEnv = process.env

function jsonResponse(body: unknown) {
    return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: jest.fn().mockResolvedValue(body),
    }
}

beforeEach(() => {
    process.env = { ...originalEnv }
    delete process.env.NEXT_PUBLIC_STRAPI_BASE_URL
    delete process.env.STRAPI_API_TOKEN
    delete process.env.VERCEL_ENV
    delete process.env.DEPLOYMENT_ENV
    global.fetch = mockFetch
    mockFetch.mockReset()
    mockFetch.mockResolvedValue(jsonResponse({ data: [] }))
})

afterAll(() => {
    global.fetch = originalFetch
    process.env = originalEnv
})

describe.each([
    ['VERCEL_ENV', 'preview'],
    ['DEPLOYMENT_ENV', 'preprod'],
])('isolated CMS guard for %s=%s', (key, value) => {
    beforeEach(() => {
        process.env[key] = value
    })

    it('requires an explicit CMS URL before making a request', async () => {
        await expect(fetchStrapi('/api/projects')).rejects.toThrow(
            'NEXT_PUBLIC_STRAPI_BASE_URL must be configured for preview/preprod.'
        )
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('rejects an explicitly configured production CMS before making a request', async () => {
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL = 'https://CMS.DEPENDANT.TV/'

        await expect(fetchStrapi('/api/projects')).rejects.toThrow(
            'must use an isolated Strapi instance'
        )
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('uses the explicitly configured isolated CMS', async () => {
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL =
            'https://cms-preprod.example.test///'

        await fetchStrapi('api/projects?populate=coverMedia')

        expect(mockFetch).toHaveBeenCalledWith(
            'https://cms-preprod.example.test/api/projects?populate=coverMedia',
            expect.any(Object)
        )
    })
})

describe('Strapi requests', () => {
    it('keeps the production fallback and default caching outside isolated environments', async () => {
        process.env.VERCEL_ENV = 'production'
        const body = { data: [{ documentId: 'published-project' }] }
        mockFetch.mockResolvedValue(jsonResponse(body))

        await expect(fetchStrapi('/api/projects')).resolves.toEqual(body)
        expect(mockFetch).toHaveBeenCalledWith(
            'https://cms.dependant.tv/api/projects',
            {
                headers: { 'Content-Type': 'application/json' },
                next: { revalidate: 3600, tags: [] },
            }
        )
    })

    it('preserves authentication, custom revalidation and cache tags', async () => {
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL =
            ' https://cms-preprod.example.test/ '
        process.env.STRAPI_API_TOKEN = 'test-only-token'

        await fetchStrapi('/api/directors?populate=project_videos', {
            revalidate: 60,
            tags: ['projects', 'directors-fr'],
        })

        expect(mockFetch).toHaveBeenCalledWith(
            'https://cms-preprod.example.test/api/directors?populate=project_videos',
            {
                headers: {
                    Authorization: 'Bearer test-only-token',
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 60, tags: ['projects', 'directors-fr'] },
            }
        )
    })

    it('preserves disabled revalidation', async () => {
        await fetchStrapi('/api/projects', { revalidate: false })

        expect(mockFetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                next: { revalidate: false, tags: [] },
            })
        )
    })

    it('treats a blank configured CMS URL as missing in preview', async () => {
        process.env.VERCEL_ENV = 'preview'
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL = '   '

        await expect(fetchStrapi('/api/projects')).rejects.toThrow(
            'NEXT_PUBLIC_STRAPI_BASE_URL'
        )
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('reports HTTP errors without trying to normalize the error response', async () => {
        const response = {
            ...jsonResponse({ error: 'Forbidden' }),
            ok: false,
            status: 403,
            statusText: 'Forbidden',
        }
        mockFetch.mockResolvedValue(response)

        await expect(fetchStrapi('/api/projects')).rejects.toThrow(
            'Strapi fetch error: 403 - Forbidden'
        )
        expect(response.json).not.toHaveBeenCalled()
    })

    it('propagates a failed network request', async () => {
        const error = new Error('Network unavailable')
        mockFetch.mockRejectedValue(error)

        await expect(fetchStrapi('/api/projects')).rejects.toBe(error)
    })
})

describe('Strapi media URLs', () => {
    it('absolutizes nested media and formats using the isolated CMS origin without changing other values or the source', async () => {
        process.env.VERCEL_ENV = 'preview'
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL =
            'https://cms-preprod.example.test/cms/'
        const photo = {
            mime: 'image/jpeg',
            url: '/uploads/cover.jpg',
            formats: {
                thumbnail: {
                    mime: 'image/jpeg',
                    url: '/uploads/thumbnail.jpg',
                },
                small: {
                    mime: 'image/webp',
                    url: 'https://cdn.example.test/small.webp',
                },
            },
        }
        const body = {
            data: [
                {
                    documentId: 'project',
                    title: '/uploads/title.jpg',
                    photo,
                    media: [
                        { mime: 'video/mp4', url: '/uploads/showreel.mp4' },
                    ],
                    link: { url: '/contact' },
                    nonMedia: { mime: null, url: '/uploads/non-media.jpg' },
                    mixed: [
                        null,
                        '/uploads/unchanged-string.jpg',
                        { url: '/uploads/no-mime.jpg' },
                        { mime: 'image/png', url: null },
                    ],
                    empty: null,
                },
            ],
            meta: { pagination: { page: 1, total: 1 } },
        }
        const sourceBeforeRequest = JSON.stringify(body)
        mockFetch.mockResolvedValue(jsonResponse(body))

        const result = await fetchStrapi('/api/projects')

        expect(result).toEqual({
            ...body,
            data: [
                {
                    ...body.data[0],
                    photo: {
                        ...photo,
                        url: 'https://cms-preprod.example.test/uploads/cover.jpg',
                        formats: {
                            ...photo.formats,
                            thumbnail: {
                                mime: 'image/jpeg',
                                url: 'https://cms-preprod.example.test/uploads/thumbnail.jpg',
                            },
                        },
                    },
                    media: [
                        {
                            mime: 'video/mp4',
                            url: 'https://cms-preprod.example.test/uploads/showreel.mp4',
                        },
                    ],
                },
            ],
        })
        expect(result).not.toBe(body)
        expect(JSON.stringify(body)).toBe(sourceBeforeRequest)
    })

    it('preserves JSON arrays, nested arrays and null values', async () => {
        const body = {
            data: [null, ['literal string', null], [], { formats: null }],
            meta: null,
        }
        mockFetch.mockResolvedValue(jsonResponse(body))

        await expect(fetchStrapi('/api/projects')).resolves.toEqual(body)
    })
})
