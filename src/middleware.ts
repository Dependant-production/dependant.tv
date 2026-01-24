import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const i18nMiddleware = createMiddleware(routing)

// Liste de bots à bloquer (SEO agressif / scrapers)
const BLOCKED_BOTS = [
    'AhrefsBot',
    'SemrushBot',
    'MJ12bot',
    'DotBot',
    'PetalBot',
    'Bytespider',
    'DataForSeoBot',
    'BLEXBot',
    'ZoominfoBot',
]

export function middleware(req: NextRequest) {
    const isProduction = process.env.NODE_ENV === 'production'
    const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'

    const url = req.nextUrl.clone()
    const ua = req.headers.get('user-agent') || ''
    const path = url.pathname

    /* -------------------------------------------------
     * 1️⃣ BLOQUAGE DES BOTS (PRIORITAIRE)
     * ------------------------------------------------- */
    if (isProduction && BLOCKED_BOTS.some((bot) => ua.includes(bot))) {
        // 403 = bloqué net (ne consomme pas de function runtime)
        return new NextResponse(null, { status: 403 })
    }

    /* -------------------------------------------------
     * 2️⃣ BLOQUAGE DES ROUTES POUBELLE (bots)
     * ------------------------------------------------- */
    if (
        path.includes('undefined') ||
        path.includes('null') ||
        path.endsWith('.map')
    ) {
        return new NextResponse(null, { status: 404 })
    }

    /* -------------------------------------------------
     * 3️⃣ MODE MAINTENANCE (inchangé, mais sécurisé)
     * ------------------------------------------------- */
    if (
        isProduction &&
        maintenanceMode &&
        !path.startsWith('/maintenance') &&
        !path.startsWith('/_next') &&
        !path.startsWith('/_vercel') &&
        !/.*\..*$/.test(path)
    ) {
        url.pathname = '/maintenance'
        return NextResponse.redirect(url)
    }

    /* -------------------------------------------------
     * 4️⃣ I18N (dernier, pour ne pas toucher aux bots)
     * ------------------------------------------------- */
    return i18nMiddleware(req)
}

/* -------------------------------------------------
 * 5️⃣ MATCHER (important pour limiter les Edge hits)
 * ------------------------------------------------- */
export const config = {
    matcher: ['/((?!maintenance|_next|_vercel|.*\\..*).*)'],
}
