export type ProjectCategory = 'photos' | 'videos'

export interface VideoProject {
    id: number
    documentId: string
    title: string
    showInProjects?: boolean | null
    showInArtistPortfolio?: boolean | null
    projectsOrder?: number | null
    director?: Pick<DirectorType, 'name'> | null
    directorName?: string | null
    mux_video_uploader_mux_assets?: {
        id: number
        playback_id: string | null
    }[]
}

export type ProjectDirector = Omit<DirectorType, 'project_videos'> & {
    project_videos?: VideoProject[]
}

export interface DirectorPortfolio {
    name: string
    project_videos?: VideoProject[]
}

export interface ProjectListItem {
    documentId: string
    category: ProjectCategory
    title: string
    creatorName: string
    projectsOrder?: number
    coverUrl?: string
    coverMime?: string
    playbackId?: string
}
