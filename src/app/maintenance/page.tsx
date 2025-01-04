import Image from 'next/image'
import styles from './Maintenance.module.scss'

export default function Maintenance() {
    return (
        <html>
            <body>
                <main className={styles.maintenance}>
                    <Image
                        src="/logoDpdBlack.png"
                        alt="logo"
                        width={500}
                        height={300}
                        layout="intrinsic"
                        className={styles.image}
                    />
                    <h1 className={styles.title}>Maintenance en cours</h1>
                    <p className={styles.text}>
                        Notre site est actuellement en maintenance. Revenez
                        bientôt !
                    </p>
                </main>
            </body>
        </html>
    )
}
