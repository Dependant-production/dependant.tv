import React from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

interface LogoProps {
    isBlack: boolean
}

export const Logo = ({ isBlack }: LogoProps) => {
    return (
        <Link href="/">
            <Image
                src={isBlack ? '/logoDpdBlack.png' : '/logoDpdWhite.png'}
                alt="Dependant.tv"
                width={100}
                height={30}
            />
        </Link>
    )
}
