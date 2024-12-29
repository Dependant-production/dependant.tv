import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const i18nMiddleware = createMiddleware(routing)

// Exemple de config i18n existante
// matcher: ['/', '/(fr|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']

export function middleware(req: NextRequest) {
    const isProduction = process.env.NODE_ENV === 'production' // or true for testing
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true' // or true for testing

    const url = req.nextUrl.clone()

    // 1) Condition Maintenance
    //    On redirige TOUT sauf /maintenance, /_next, /_vercel, etc.
    if (
        isProduction &&
        maintenanceMode &&
        !url.pathname.startsWith('/maintenance') &&
        !url.pathname.startsWith('/_next') &&
        !url.pathname.startsWith('/_vercel') &&
        // on exclut aussi les fichiers statiques (pattern .*\\..*),
        // sinon vous risquez de bloquer les assets CSS/JS
        !/.*\..*$/.test(url.pathname)
    ) {
        url.pathname = '/maintenance'
        return NextResponse.redirect(url)
    }

    // 2) Sinon, exécuter le middleware i18n
    return i18nMiddleware(req)
}

// 3) Ajuster le config.matcher pour EXCLURE /maintenance
export const config = {
    matcher: [
        // On exclut '/maintenance' explicitement pour qu'il ne rentre PAS dans i18n
        // On exclut également les _next, _vercel, etc.
        // Enfin, on capture toutes les autres routes pour i18n
        '/((?!maintenance|_next|_vercel|.*\\..*).*)',
    ],
}
