/* eslint-disable @typescript-eslint/no-explicit-any */
interface LocaleParams {
    params: { locale: string }
}
type Locale = 'en' | 'fr'
type tParams = Promise<{ locale: string }>

interface HomepageItem {
    createdAt: string
    director?: DirectorType
    directorNameBIS?: string | null
    documentId: string
    id: number
    order: number
    publishedAt: string
    title: string
    updatedAt: string
    url: MediaType[]
}
type HomepageData = HomepageItem[]

interface MediaType {
    alternativeText: string | null
    caption: string | null
    createdAt: string
    documentId: string
    ext: string
    formats?: Record<string, unknown>
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

interface VideoType {
    documentId: string
    id: number
    createdAt: string
    updatedAt: string
    title: string
    url: MediaType[]
}
interface DirectorType {
    createdAt: string
    documentId: string
    id: number
    name: string
    publishedAt: string
    slug: string
    updatedAt: string
    titleVideo: string
    videos: VideoType[]
    coverVideo: MediaType
    mux_video_uploader_mux_assets: any
}
type DirectorsDataType = DirectorType[]

interface PhotographerType {
    id: number
    documentId: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    titlePhoto?: string
    photo?: MediaType
    projects?: ProjectType[]
}
type PhotographerDataType = PhotographerType[]
interface ProjectType {
    id: number
    documentId: string
    title: string
    projectSlug: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    coverMedia?: MediaType
    media?: MediaType[]
}
