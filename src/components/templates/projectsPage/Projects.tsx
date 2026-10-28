'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import MuxPlayer from '@mux/mux-player-react'
import { Link } from '@/i18n/routing'
import type { ProjectListItem } from '@/types/projects'
import styles from './Projects.module.scss'

interface ProjectsProps {
    projects: ProjectListItem[]
}

export default function Projects({ projects }: ProjectsProps) {
    const t = useTranslations('Projects')
    const [selectedProject, setSelectedProject] = useState(projects[0])
    const containerRef = useRef<HTMLElement | null>(null)

    useGSAP(
        () => {
            const names = containerRef.current?.querySelectorAll(
                `.${styles.name}`
            )
            if (!names?.length) return

            gsap.fromTo(
                names,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.6,
                    stagger: { amount: 0.6 },
                    ease: 'power2.out',
                }
            )
        },
        { scope: containerRef }
    )

    const currentProject =
        projects.find(
            (project) =>
                project.category === selectedProject?.category &&
                project.documentId === selectedProject?.documentId
        ) ?? projects[0]

    return (
        <main className={styles.projectsContainer} ref={containerRef}>
            <div className={styles.preview} aria-hidden="true">
                {currentProject?.playbackId ? (
                    <MuxPlayer
                        key={currentProject.playbackId}
                        playbackId={currentProject.playbackId}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={styles.backgroundVideo}
                    />
                ) : currentProject?.coverUrl ? (
                    currentProject.coverMime?.startsWith('video/') ? (
                        <video
                            key={currentProject.coverUrl}
                            src={currentProject.coverUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={styles.backgroundMedia}
                        />
                    ) : (
                        <Image
                            src={currentProject.coverUrl}
                            alt=""
                            fill
                            sizes="100vw"
                            className={styles.backgroundMedia}
                        />
                    )
                ) : null}
            </div>
            <section className={styles.textContainer}>
                {projects.length > 0 ? (
                    <ul className={styles.nameContainer}>
                        {projects.map((project) => (
                            <li
                                key={`${project.category}-${project.documentId}`}
                                className={styles.name}
                            >
                                <Link
                                    href={`/projects/${project.category}/${encodeURIComponent(project.documentId)}`}
                                    className={styles.link}
                                    onMouseEnter={() =>
                                        setSelectedProject(project)
                                    }
                                    onFocus={() => setSelectedProject(project)}
                                >
                                    {project.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.empty}>{t('empty')}</p>
                )}
                {currentProject && (
                    <p className={styles.creatorName}>
                        {currentProject.creatorName}
                    </p>
                )}
            </section>
        </main>
    )
}
