/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import client from '@/utils/contentful'
import styles from './slug.module.scss'

interface DirectorDetailsProps {
    params: {
        slug: string
    }
}

interface ProjectsProps {
    projectName: string | null
    mediaUrls: { url: string | undefined }[]
}

export default function DirectorDetails({ params }: DirectorDetailsProps) {
    const [projects, setProjects] = useState<ProjectsProps[]>([])
    const [directorName, setDirectorName] = useState<string>('')

    console.log('projects', projects)

    useEffect(() => {
        const formattedSlug = decodeURIComponent(params.slug)
            .replace(/ /g, '-')
            .toLowerCase()

        const fetchProjects = async () => {
            try {
                const response = await client.getEntries({
                    content_type: 'directorsProjects',
                    'fields.directorName.sys.contentType.sys.id': 'directors',
                    'fields.directorName.fields.slug': formattedSlug,
                })

                if (response.items.length > 0) {
                    const fetchedDirectorName = (
                        response.items[0]?.fields?.directorName as any
                    )?.fields?.name as string
                    setDirectorName(fetchedDirectorName)
                    setProjects(
                        response.items.map((item) => {
                            const mediaUrls = Array.isArray(
                                item.fields.mediaUrls
                            )
                                ? item.fields.mediaUrls.map(
                                      (mediaItem: any) => ({
                                          url: mediaItem.fields.file
                                              .url as string,
                                      })
                                  )
                                : []

                            return {
                                projectName: item.fields.projectName as string,
                                mediaUrls,
                            }
                        })
                    )
                }
            } catch (error) {
                console.error('Error fetching projects from Contentful:', error)
            }
        }

        fetchProjects()
    }, [params.slug])

    return (
        <main className={styles.directorDetailsContainer}>
            <h1 className={styles.directorDetailsName}>{directorName}</h1>
            <section className={styles.directorDetailsProjects}>
                {/* {projects.map((project, index) => (
          <div key={index} className={styles.projectItem}>
            <h2>toto</h2>  // {project?.title}
            <p>{project?.description}</p>
            {project?.videoUrl ? (
              <video
                className={styles.projectVideo}
                src={project.videoUrl}
                controls
                loop
              />
            ) : (
              <img
                className={styles.projectImage}
                src={project.imageUrl}
                alt={project.title}
              />
            )}
          </div>
        ))} */}
            </section>
        </main>
    )
}
