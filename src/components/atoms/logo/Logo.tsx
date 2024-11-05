import React from 'react'
import styles from './Logo.module.scss'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

export const Logo = () => {
    return (
        <Link href="/" className={styles.logo}>
            <Image
                src="/logoDpdBlack.png"
                alt="Dependant.tv"
                width={100}
                height={30}
            />
        </Link>
    )
}
