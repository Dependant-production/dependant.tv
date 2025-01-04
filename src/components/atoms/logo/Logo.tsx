import React from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import styles from './Logo.module.scss'

interface LogoProps {
    isBlack: boolean
}

export const Logo = ({ isBlack }: LogoProps) => {
    return (
        <Link href="/" className={styles.logo}>
            <Image
                src={isBlack ? '/logoDpdBlack.png' : '/logoDpdWhite.png'}
                alt="Dependant.tv"
                width={150}
                height={100}
                layout="intrinsic"
            />
        </Link>
    )
}
