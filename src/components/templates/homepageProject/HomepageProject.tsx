import styles from './HomepageProject.module.scss'

interface HomepageProjectProps {
    title: string
    creatorName: string
    videoUrl: string
}

export default function HomepageProject({
    title,
    creatorName,
    videoUrl,
}: HomepageProjectProps) {
    return (
        <main className={styles.homepageProject}>
            <video
                className={styles.video}
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                controls
            />
            <div className={styles.caption}>
                <h2 className={styles.title}>{`"${title}"`}</h2>
                <h3 className={styles.creatorName}>{creatorName}</h3>
            </div>
        </main>
    )
}
