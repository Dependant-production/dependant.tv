import React from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import styles from './Logo.module.scss'

interface LogoProps {
    isBlack: 'white' | 'black'
}

export const Logo = ({ isBlack }: LogoProps) => {
    return (
        <Link href="/" className={styles.logo}>
            <Image
                src={
                    isBlack === 'black'
                        ? '/logoDpdBlack.png'
                        : '/logoDpdWhite.png'
                }
                alt="Dependant.tv logo"
                width={150}
                height={100}
                layout="intrinsic"
            />
        </Link>
    )
}
