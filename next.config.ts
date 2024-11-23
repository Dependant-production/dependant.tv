import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    images: {
        domains: ['localhost', '127.0.0.1'], // Ajouter localhost pour autoriser les images de ce domaine
    },
}

export default withNextIntl(nextConfig)
