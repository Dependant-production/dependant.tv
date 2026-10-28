import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const strapiBaseURL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL?.trim()
const strapiURL = strapiBaseURL ? new URL(strapiBaseURL) : undefined

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'd2pq7mh0qct8hv.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'cms.dependant.tv',
            },
            ...(strapiURL
                ? [
                      {
                          protocol:
                              strapiURL.protocol === 'http:'
                                  ? ('http' as const)
                                  : ('https' as const),
                          hostname: strapiURL.hostname,
                          port: strapiURL.port,
                      },
                  ]
                : []),
        ],
    },
}

export default withNextIntl(nextConfig)
