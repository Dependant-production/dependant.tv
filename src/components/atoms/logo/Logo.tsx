import Link from 'next/link'
import React from 'react'
import styles from './Logo.module.css'

export const Logo = () => {
  return (
    <Link href="/" className={styles.logo}>Logo</Link>
  )
}
