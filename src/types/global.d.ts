interface LocaleParams {
    params: { locale: string }
}

type Locale = 'en' | 'fr'

type tParams = Promise<{ locale: string }>

interface DirectorType {
    createdAt: string
    documentId: string
    id: number
    name: string
    publishedAt: string
    slug: string
    updatedAt: string
}

interface MediaType {
    alternativeText: string | null
    caption: string | null
    createdAt: string
    documentId: string
    ext: string
    formats: null | Record<string, unknown>
    hash: string
    height: number | null
    id: number
    mime: string
    name: string
    previewUrl: string | null
    provider: string
    provider_metadata: string | null
    publishedAt: string
    size: number
    updatedAt: string
    url: string
    width: number | null
}

interface HomepageItem {
    createdAt: string
    director?: DirectorType // Peut être undefined
    directorNameBIS?: string | null // Peut être une string ou null
    documentId: string
    id: number
    order: number
    publishedAt: string
    title: string
    updatedAt: string
    url: MediaType[] // Un tableau de médias (vidéos/images)
}

type HomepageData = HomepageItem[]
