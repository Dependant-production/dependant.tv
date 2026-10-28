import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    robots:
        process.env.VERCEL_ENV === 'preview' ||
        process.env.DEPLOYMENT_ENV === 'preprod'
            ? { index: false, follow: false }
            : undefined,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <body>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    )
}
