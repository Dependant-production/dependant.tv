import React from 'react'
import { Logo } from '../atoms/logo/Logo'
import Link from 'next/link'
import styles from './Layout.module.css'

export const Header = () => {
  return (
    <header className={styles.header}>
        <Logo />
        <nav>
            <ul>
                <li><Link href="/director">Director</Link></li>
                <li><Link href="/photographer">Photographer</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </nav>
    </header>
  )
}
