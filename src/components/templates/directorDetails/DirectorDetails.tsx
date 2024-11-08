/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import styles from './DirectorDetails.module.scss'

interface DirectorDetailsProps {
    directorData: any
}

export default function DirectorDetails({
    directorData,
}: DirectorDetailsProps) {
    const directorName = directorData?.fields?.directorName?.fields?.name
    const projects = directorData?.fields?.projects || []

    console.log('projects', projects)

    const spaceIndex = directorName.indexOf(' ')
    console.log('spaceIndex', spaceIndex)

    return (
        <main className={styles.directorDetailsContainer}>
            <h1>
                {spaceIndex !== -1 ? (
                    <span className={styles.directorDetailsName}>
                        <span>{directorName.slice(0, spaceIndex)}</span> <br />
                        <span>{directorName.slice(spaceIndex + 1)}</span>
                    </span>
                ) : (
                    <span className={styles.directorDetailsName}>
                        {directorName}
                    </span>
                )}
            </h1>
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
