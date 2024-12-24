import createNextIntlPlugin from 'next-intl/plugin'
import { withNextVideo } from 'next-video/process'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        domains: ['d2pq7mh0qct8hv.cloudfront.net'],
    },
}
const combinedConfig = withNextVideo(withNextIntl(nextConfig))

export default combinedConfig
