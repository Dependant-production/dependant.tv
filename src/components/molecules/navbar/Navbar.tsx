'use client'
import { Link, usePathname } from '@/i18n/routing'
import styles from './Navbar.module.scss'

interface NavbarProps {
    cat1: string
    cat2: string
    cat3: string
}

export default function Navbar({ cat1, cat2, cat3 }: NavbarProps) {
    const pathname = usePathname()
    const isActive = (path: string) => pathname?.includes(path)

    return (
        <nav className={styles.navbar}>
            <Link
                href="/directors"
                className={`${styles.link} ${
                    isActive('/directors') ? styles.active : ''
                }`}
            >
                {cat1}
            </Link>
            <Link
                href="/photographers"
                className={`${styles.link} ${
                    isActive('/photographers') ? styles.active : ''
                }`}
            >
                {cat2}
            </Link>
            <Link
                href="/contact"
                className={`${styles.link} ${
                    isActive('/contact') ? styles.active : ''
                }`}
            >
                {cat3}
            </Link>
        </nav>
    )
}
