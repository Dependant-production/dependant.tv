// helpers/fetchStrapi.ts
type FetchStrapiOptions = {
    revalidate?: number | false
    tags?: string[]
}

type StrapiResponse<T> = {
    data: T
    meta?: {
        pagination?: {
            page: number
            pageSize: number
            pageCount: number
            total: number
        }
    }
}

function normalizeMediaUrls(value: unknown, origin: string): unknown {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeMediaUrls(item, origin))
    }

    if (value === null || typeof value !== 'object') return value

    const record = value as Record<string, unknown>
    const normalized = Object.fromEntries(
        Object.entries(record).map(([key, item]) => [
            key,
            normalizeMediaUrls(item, origin),
        ])
    )

    if (
        typeof record.mime === 'string' &&
        typeof record.url === 'string' &&
        record.url.startsWith('/')
    ) {
        normalized.url = new URL(record.url, origin).href
    }

    return normalized
}

export async function fetchStrapi<T>(
    endpoint: string,
    options: FetchStrapiOptions = {}
): Promise<StrapiResponse<T>> {
    const {
        revalidate = 3600, // 1h par défaut
        tags = [],
    } = options

    const configuredBaseURL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL?.trim()
    const requiresIsolatedCMS =
        process.env.VERCEL_ENV === 'preview' ||
        process.env.DEPLOYMENT_ENV === 'preprod'

    if (requiresIsolatedCMS && !configuredBaseURL) {
        throw new Error(
            'NEXT_PUBLIC_STRAPI_BASE_URL must be configured for preview/preprod.'
        )
    }

    const baseURL = (configuredBaseURL || 'https://cms.dependant.tv').replace(
        /\/+$/,
        ''
    )
    const cmsURL = new URL(baseURL)

    if (requiresIsolatedCMS && cmsURL.hostname === 'cms.dependant.tv') {
        throw new Error(
            'Preview/preprod must use an isolated Strapi instance, not cms.dependant.tv.'
        )
    }

    const url = `${baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const res = await fetch(url, {
        headers: {
            ...(process.env.STRAPI_API_TOKEN && {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            }),
            'Content-Type': 'application/json',
        },
        next: {
            revalidate,
            tags,
        },
    })

    if (!res.ok) {
        throw new Error(`Strapi fetch error: ${res.status} - ${res.statusText}`)
    }

    return normalizeMediaUrls(
        await res.json(),
        cmsURL.origin
    ) as StrapiResponse<T>
}
