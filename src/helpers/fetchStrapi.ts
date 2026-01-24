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

export async function fetchStrapi<T>(
    endpoint: string,
    options: FetchStrapiOptions = {}
): Promise<StrapiResponse<T>> {
    const {
        revalidate = 3600, // 1h par défaut
        tags = [],
    } = options

    const baseURL =
        process.env.NEXT_PUBLIC_STRAPI_BASE_URL || 'https://cms.dependant.tv'
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

    return res.json()
}
