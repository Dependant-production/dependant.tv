'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import MuxPlayer from '@mux/mux-player-react'
import { Link } from '@/i18n/routing'
import { previewsOnTap } from '@/helpers/tapToPreview'
import type { ProjectListItem } from '@/types/projects'
import styles from './Projects.module.scss'

interface ProjectsProps {
    projects: ProjectListItem[]
    // Projects listed before the "more" button; undefined lists them all.
    beforeMore?: number
}

export default function Projects({ projects, beforeMore }: ProjectsProps) {
    const t = useTranslations('Projects')
    const [selectedProject, setSelectedProject] = useState(projects[0])
    const [showAll, setShowAll] = useState(false)
    const containerRef = useRef<HTMLElement | null>(null)
    const listRef = useRef<HTMLUListElement | null>(null)
    // Height of the list when "more" was clicked, to unfold it from there.
    const heightBeforeMore = useRef(0)
    const listedProjects =
        showAll || !beforeMore ? projects : projects.slice(0, beforeMore)
    const hasMore = listedProjects.length < projects.length
    // Number of projects listed before "more" was clicked, if it was.
    const revealedFrom = showAll ? beforeMore : undefined

    useGSAP(
        () => {
            const names = containerRef.current?.querySelectorAll(
                `.${styles.name}`
            )
            if (!names?.length) return

            // On arrival every name fades in.
            if (revealedFrom === undefined) {
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
                return
            }

            // After "more", the list sits at the bottom of the screen and grows
            // upwards: it unfolds from its former height instead of pushing the
            // names up at once, while the new ones rise into the room it makes.
            if (heightBeforeMore.current > 0) {
                gsap.from(listRef.current, {
                    height: heightBeforeMore.current,
                    duration: 0.8,
                    ease: 'power3.inOut',
                    clearProps: 'height',
                })
            }
            gsap.fromTo(
                Array.from(names).slice(revealedFrom),
                { opacity: 0, y: '0.5em' },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: 0.2,
                    stagger: { amount: 0.6 },
                    ease: 'power2.out',
                }
            )
        },
        { scope: containerRef, dependencies: [revealedFrom] }
    )

    useEffect(() => {
        if (revealedFrom === undefined) return

        // The button is gone: keep the focus on the first project it revealed.
        containerRef.current
            ?.querySelectorAll<HTMLElement>(`.${styles.link}`)
            [revealedFrom]?.focus()
    }, [revealedFrom])

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
                    <ul className={styles.nameContainer} ref={listRef}>
                        {listedProjects.map((project) => {
                            const isSelected = project === currentProject

                            return (
                                <li
                                    key={`${project.category}-${project.documentId}`}
                                    className={styles.name}
                                >
                                    <Link
                                        href={`/projects/${project.category}/${encodeURIComponent(project.documentId)}`}
                                        className={`${styles.link} ${isSelected ? styles.selected : ''}`}
                                        onPointerEnter={(event) => {
                                            if (event.pointerType !== 'touch') {
                                                setSelectedProject(project)
                                            }
                                        }}
                                        onFocus={(event) => {
                                            // A tap also focuses the link; only
                                            // keyboard focus previews it.
                                            if (
                                                event.currentTarget.matches(
                                                    ':focus-visible'
                                                )
                                            ) {
                                                setSelectedProject(project)
                                            }
                                        }}
                                        onClick={(event) => {
                                            if (
                                                !isSelected &&
                                                previewsOnTap()
                                            ) {
                                                event.preventDefault()
                                                setSelectedProject(project)
                                            }
                                        }}
                                    >
                                        {project.title}
                                    </Link>
                                </li>
                            )
                        })}
                        {hasMore && (
                            <li className={styles.name}>
                                <button
                                    type="button"
                                    aria-label={t('more')}
                                    className={`${styles.link} ${styles.more}`}
                                    onClick={() => {
                                        heightBeforeMore.current =
                                            listRef.current?.offsetHeight ?? 0
                                        setShowAll(true)
                                    }}
                                >
                                    [{t('more')}]
                                </button>
                            </li>
                        )}
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
