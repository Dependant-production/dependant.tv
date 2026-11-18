export type ProjectCategory = 'photos' | 'videos' | 'homepage'

export type ProjectSection =
    | 'commercials'
    | 'music-videos'
    | 'photography'
    | 'unscripted'

export interface VideoProject {
    id: number
    documentId: string
    title: string
    projectsSection?: ProjectSection | null
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

// Strapi single type `projectsTab`: projects each section shows before its
// "more" button. Empty or 0 shows them all.
export interface ProjectsTab {
    commercialsBeforeMore?: number | null
    musicVideosBeforeMore?: number | null
    photographyBeforeMore?: number | null
    unscriptedBeforeMore?: number | null
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
