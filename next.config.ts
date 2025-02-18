import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        domains: ['d2pq7mh0qct8hv.cloudfront.net', 'cms.dependant.tv'],
    },
    devServer: {
        allowedHosts: 'all',
    },
}

export default withNextIntl(nextConfig)
