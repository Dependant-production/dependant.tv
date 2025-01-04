import React from 'react'
import styles from './SideNav.module.scss'
import { Link, usePathname } from '@/i18n/routing'

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
    const isActive = (path: string) => pathname?.includes(path)

    const blackRoutes = ['/photographers', '/contact']
    const isBlack = blackRoutes.some((route) => pathname.startsWith(route))
    const color = isBlack ? 'black' : 'white'

    return (
        <nav className={className} style={{ color: color }}>
            <ul className={styles.sideNavContainer}>
                <li>
                    <Link
                        href={srcPhotographer}
                        className={
                            isActive('/photographer') ? styles.active : ''
                        }
                    >
                        Photographers
                    </Link>
                </li>
                <li>
                    <Link
                        href={srcDirector}
                        className={isActive('/director') ? styles.active : ''}
                    >
                        Directors
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
