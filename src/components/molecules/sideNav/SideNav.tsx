import React from 'react'
import { Link, usePathname } from '@/i18n/routing'
import useMobile from '@/hooks/useMobile'
import styles from './SideNav.module.scss'

interface SideNavProps {
    className?: string
    srcPhotographer: string
    srcDirector: string
}

export default function SideNav({
    className,
    srcPhotographer,
    srcDirector,
}: SideNavProps) {
    const pathname = usePathname()
    const isMobile = useMobile()
    const isActive = (path: string) => pathname?.includes(path)

    const blackRoutes = ['/photographers', '/contact']
    const isBlack = blackRoutes.some((route) => pathname.startsWith(route))
    const isPhotographers = pathname.startsWith('/photographers')
    const color =
        isBlack && isMobile && isPhotographers
            ? 'white'
            : isBlack
              ? 'black'
              : 'white'

    return (
        <nav className={className} style={{ color: color }}>
            <ul className={styles.sideNavContainer}>
                <li>
                    <Link
                        href={srcPhotographer}
                        className={`${styles.link} ${
                            isActive('/photographer') && styles.active
                        }`}
                    >
                        Photographers
                        {isActive('/photographer') && (
                            <span
                                className={styles.circle}
                                style={{ backgroundColor: color }}
                            />
                        )}
                    </Link>
                </li>
                <li>
                    <Link
                        href={srcDirector}
                        className={`${styles.link} ${
                            isActive('/director') && styles.active
                        }`}
                    >
                        Directors
                        {isActive('/director') && (
                            <span
                                className={styles.circle}
                                style={{ backgroundColor: color }}
                            />
                        )}
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
