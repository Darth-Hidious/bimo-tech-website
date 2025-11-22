import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["pl", "en", "de", "fr", "es", "it", "nl", "sv", "fi", "da", "pt", "cz"];
const defaultLocale = "pl";

function getLocale(request: NextRequest) {
    // Simple logic: check cookie or accept-language header, or default
    // For now, just return default
    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|favicon.ico|logo.png|api|.*\\..*).*)',
    ],
};
