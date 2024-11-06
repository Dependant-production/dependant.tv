'use client'
import { Link } from '@/i18n/routing'
import styles from './Navbar.module.scss'

interface NavbarProps {
    cat1: string
    cat2: string
    cat3: string
}

export default function Navbar({ cat1, cat2, cat3 }: NavbarProps) {
    return (
        <nav className={styles.navbar}>
            <Link href="/directors">{cat1}</Link>
            <Link href="/photographers">{cat2}</Link>
            <Link href="/contact">{cat3}</Link>
        </nav>
    )
}
