import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { LayoutProps } from '../../../.next/types/app/layout'

import { routing } from '@/i18n/routing'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import BaseLayout from '@/components/templates/baseLayout/BaseLayout'
import Loading from './loading'

import './globals.scss'

// Fonts
const customFont = localFont({
    src: [
        {
            path: '../fonts/NeueHaasDisplayBlack.ttf',
            weight: '900',
            style: 'normal',
        },
        {
            path: '../fonts/NeueHaasDisplayBold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../fonts/NeueHaasDisplayMedium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../fonts/NeueHaasDisplayRoman.ttf',
            weight: '400',
        },
    ],
    variable: '--font-neue-haas',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Dependant.tv',
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function HomeLayout({ children, params }: LayoutProps) {
    const { locale } = await params

    if (!routing.locales.includes(locale as Locale)) {
        notFound()
    }

    return (
        <BaseLayout locale={locale} className={customFont.className}>
            <Suspense fallback={<Loading />}>
                {children}
                <Analytics />
                <SpeedInsights />
            </Suspense>
        </BaseLayout>
    )
}
