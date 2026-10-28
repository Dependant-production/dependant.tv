'use client'
import { Link, usePathname } from '@/i18n/routing'
import styles from './Navbar.module.scss'

interface NavbarProps {
    cat1: string
    cat2: string
    cat3: string
    projects: string
    color?: 'black' | 'white'
}

export default function Navbar({
    cat1,
    cat2,
    cat3,
    projects,
    color = 'white',
}: NavbarProps) {
    const pathname = usePathname()
    const isActive = (path: string) =>
        pathname === path || pathname.startsWith(`${path}/`)

    const navbarColorClass = color === 'black' ? styles.black : styles.white

    return (
        <nav className={`${styles.navbar} ${navbarColorClass}`}>
            <Link
                href="/directors"
                aria-current={isActive('/directors') ? 'page' : undefined}
                className={`${styles.link} ${
                    isActive('/directors') ? styles.active : ''
                }`}
            >
                {cat1}
            </Link>
            <Link
                href="/photographers"
                aria-current={isActive('/photographers') ? 'page' : undefined}
                className={`${styles.link} ${
                    isActive('/photographers') ? styles.active : ''
                }`.trim()}
            >
                {cat2}
            </Link>
            <Link
                href="/projects"
                aria-current={isActive('/projects') ? 'page' : undefined}
                className={`${styles.link} ${
                    isActive('/projects') ? styles.active : ''
                }`.trim()}
            >
                {projects}
            </Link>
            <Link
                href="/contact"
                aria-current={isActive('/contact') ? 'page' : undefined}
                className={`${styles.link} ${
                    isActive('/contact') ? styles.active : ''
                }`.trim()}
            >
                {cat3}
            </Link>
        </nav>
    )
}
