import { fetchStrapi } from './fetchStrapi'
import type {
    DirectorPortfolio,
    ProjectListItem,
    VideoProject,
} from '@/types/projects'

const PROJECTS_REVALIDATE = 60

async function fetchAll<T>(endpoint: string, tags: string[]): Promise<T[]> {
    const items: T[] = []
    let page = 1
    let pageCount = 1

    do {
        const response = await fetchStrapi<T[]>(
            `${endpoint}&sort=id:asc&pagination[page]=${page}&pagination[pageSize]=100`,
            { revalidate: PROJECTS_REVALIDATE, tags }
        )

        items.push(...response.data)
        pageCount = response.meta?.pagination?.pageCount ?? 1
        page += 1
    } while (page <= pageCount)

    return items
}

// Empty or 0 (the former CMS default) means the project has no set order.
function toProjectsOrder(order?: number | null) {
    return order && order > 0 ? order : undefined
}

// Projects with an order come first; the others follow alphabetically.
function compareProjectsOrder(a?: number, b?: number) {
    if (a === b) return 0
    if (a === undefined) return 1
    if (b === undefined) return -1
    return a - b
}

// Projects are read directly rather than through their artist, so they stay
// listed while the artist is a draft; the CMS adds the artist name
// (`photographerName` / `directorName`) for that case.
export async function getProjects(locale: string): Promise<ProjectListItem[]> {
    const language = encodeURIComponent(locale)
    const [photos, videos] = await Promise.all([
        fetchAll<ProjectType>(
            `/api/projects?locale=${language}&filters[showInProjects][$eq]=true&populate=coverMedia`,
            ['projects', 'photo-projects', `photo-projects-${locale}`]
        ),
        fetchAll<VideoProject>(
            `/api/project-videos?locale=${language}&filters[showInProjects][$eq]=true&populate[0]=director&populate[1]=mux_video_uploader_mux_assets`,
            ['projects', 'project-videos', `project-videos-${locale}`]
        ),
    ])

    const projects = new Map<string, ProjectListItem>()

    for (const project of photos) {
        if (project.showInProjects !== true) continue
        const key = `photos-${project.documentId}`
        if (projects.has(key)) continue

        projects.set(key, {
            documentId: project.documentId,
            category: 'photos',
            title: project.title,
            creatorName: project.photographerName || '',
            projectsOrder: toProjectsOrder(project.projectsOrder),
            coverUrl: project.coverMedia?.url,
            coverMime: project.coverMedia?.mime,
        })
    }

    for (const project of videos) {
        if (project.showInProjects !== true) continue
        const key = `videos-${project.documentId}`
        if (projects.has(key)) continue
        const playbackId = project.mux_video_uploader_mux_assets?.find(
            (asset) => asset.playback_id
        )?.playback_id
        if (!playbackId) continue

        projects.set(key, {
            documentId: project.documentId,
            category: 'videos',
            title: project.title,
            creatorName: project.director?.name || project.directorName || '',
            projectsOrder: toProjectsOrder(project.projectsOrder),
            playbackId,
        })
    }

    return [...projects.values()].sort(
        (a, b) =>
            compareProjectsOrder(a.projectsOrder, b.projectsOrder) ||
            a.title.localeCompare(b.title, locale, { sensitivity: 'base' }) ||
            a.creatorName.localeCompare(b.creatorName, locale)
    )
}

export async function getPhotoProject(locale: string, documentId: string) {
    const response = await fetchStrapi<ProjectType[]>(
        `/api/projects?locale=${encodeURIComponent(locale)}&filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate=media`,
        {
            revalidate: PROJECTS_REVALIDATE,
            tags: ['projects', 'photo-projects', `photo-projects-${locale}`],
        }
    )

    const project = response.data.find((item) => item.documentId === documentId)
    if (!project) return null

    return { project, photographerName: project.photographerName || '' }
}

export async function getVideoProject(
    locale: string,
    documentId: string
): Promise<DirectorPortfolio | null> {
    const response = await fetchStrapi<VideoProject[]>(
        `/api/project-videos?locale=${encodeURIComponent(locale)}&filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate[0]=director&populate[1]=mux_video_uploader_mux_assets`,
        {
            revalidate: PROJECTS_REVALIDATE,
            tags: ['projects', 'project-videos', `project-videos-${locale}`],
        }
    )

    const project = response.data.find((item) => item.documentId === documentId)
    if (!project) return null

    const assets = project.mux_video_uploader_mux_assets?.filter(
        (asset) => asset.playback_id
    )
    if (!assets?.length) return null

    return {
        name: project.director?.name || project.directorName || '',
        project_videos: [{ ...project, mux_video_uploader_mux_assets: assets }],
    }
}
