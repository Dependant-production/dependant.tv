/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import BaseLayout from '@/components/templates/baseLayout/BaseLayout'
import './globals.scss'
import { LayoutProps } from '../../../.next/types/app/layout'
import localFont from 'next/font/local'
import { Suspense } from 'react'
import Loading from './loading'

const fontBlack = localFont({
    src: '../fonts/NeueHaasDisplayBlack.ttf',
    variable: '--font-neue-black',
})
const fontBold = localFont({
    src: '../fonts/NeueHaasDisplayBold.ttf',
    variable: '--font-neue-bold',
})
const fontMedium = localFont({
    src: '../fonts/NeueHaasDisplayMediu.ttf',
    variable: '--font-neue-medium',
})
const fontRoman = localFont({
    src: '../fonts/NeueHaasDisplayRoman.ttf',
    variable: '--font-neue-roman',
})

export const metadata: Metadata = {
    title: 'Dependant.tv',
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export default async function HomeLayout({ children, params }: LayoutProps) {
    const { locale } = await params

    if (!routing.locales.includes(locale as any)) {
        notFound()
    }

    return (
        <BaseLayout
            locale={locale}
            className={`${fontBlack.variable} ${fontBold.variable} ${fontMedium.variable} ${fontRoman.variable}`}
        >
            <Suspense fallback={<Loading />}>
                {children}
                <Analytics />
            </Suspense>
        </BaseLayout>
    )
}
