'use client'
import { Link, usePathname } from '@/i18n/routing'
import styles from './Navbar.module.scss'
import { useLocale } from 'next-intl'

interface NavbarProps {
    cat1: string
    cat2: string
    cat3: string
    color?: 'black' | 'white'
}

export default function Navbar({
    cat1,
    cat2,
    cat3,
    color = 'white',
}: NavbarProps) {
    const pathname = usePathname()
    const isActive = (path: string) => pathname?.includes(path)
    const currentLocale = useLocale()

    const navbarColorClass = color === 'black' ? styles.black : styles.white

    return (
        <nav className={`${styles.navbar} ${navbarColorClass}`}>
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
                className={`${
                    currentLocale === 'fr' ? styles.margin : styles.padding
                } ${styles.link} ${
                    isActive('/photographers') ? styles.active : ''
                }`.trim()}
            >
                {cat2}
            </Link>
            <Link
                href="/contact"
                className={`${styles.link} ${
                    isActive('/photographers') ? styles.active : ''
                }`.trim()}
            >
                {cat3}
            </Link>
        </nav>
    )
}
