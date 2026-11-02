import { fetchStrapi } from './fetchStrapi'
import type {
    DirectorPortfolio,
    ProjectListItem,
    ProjectSection,
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

export function isProjectSection(value: string): value is ProjectSection {
    return ['commercials', 'music-videos', 'photography'].includes(value)
}

// Empty or 0 (the former CMS default) means the project has no set order.
function toProjectsOrder(order?: number | null) {
    return order && order > 0 ? order : undefined
}

function toHomepageCredit(video: HomepageItem) {
    return (
        video.director?.name ||
        video.directorName ||
        video.directorNameBIS ||
        ''
    )
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
// (`photographerName` / `directorName`) for that case. Homepage videos can be
// listed too: their file is both the preview and the video of their page.
export async function getProjects(
    locale: string,
    section: ProjectSection
): Promise<ProjectListItem[]> {
    const language = encodeURIComponent(locale)
    const inSection = `filters[projectsSection][$eq]=${section}`
    const [photos, videos, homepageVideos] = await Promise.all([
        fetchAll<ProjectType>(
            `/api/projects?locale=${language}&${inSection}&populate=coverMedia`,
            ['projects', 'photo-projects', `photo-projects-${locale}`]
        ),
        fetchAll<VideoProject>(
            `/api/project-videos?locale=${language}&${inSection}&populate[0]=director&populate[1]=mux_video_uploader_mux_assets`,
            ['projects', 'project-videos', `project-videos-${locale}`]
        ),
        fetchAll<HomepageItem>(
            `/api/homepage-videos?locale=${language}&${inSection}&populate[0]=director&populate[1]=url`,
            ['projects', 'homepage-videos', `homepage-videos-${locale}`]
        ),
    ])

    const projects = new Map<string, ProjectListItem>()

    for (const project of photos) {
        if (project.projectsSection !== section) continue
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
        if (project.projectsSection !== section) continue
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

    for (const project of homepageVideos) {
        if (project.projectsSection !== section) continue
        const key = `homepage-${project.documentId}`
        if (projects.has(key)) continue
        const video = project.url?.[0]
        if (!video) continue

        projects.set(key, {
            documentId: project.documentId,
            category: 'homepage',
            title: project.title,
            creatorName: toHomepageCredit(project),
            projectsOrder: toProjectsOrder(project.projectsOrder),
            coverUrl: video.url,
            coverMime: video.mime,
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

export async function getHomepageProject(locale: string, documentId: string) {
    const response = await fetchStrapi<HomepageItem[]>(
        `/api/homepage-videos?locale=${encodeURIComponent(locale)}&filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate[0]=director&populate[1]=url`,
        {
            revalidate: PROJECTS_REVALIDATE,
            tags: ['projects', 'homepage-videos', `homepage-videos-${locale}`],
        }
    )

    const project = response.data.find((item) => item.documentId === documentId)
    const video = project?.url?.[0]
    if (!project || !video) return null

    return {
        title: project.title,
        creatorName: toHomepageCredit(project),
        videoUrl: video.url,
    }
}
