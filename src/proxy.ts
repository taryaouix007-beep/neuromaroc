import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en", "ar"];
const defaultLocale = "fr";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip assets, APIs, and next internal paths (backup check alongside matcher)
  const shouldSkip = [
    /^\/api\//,
    /^\/_next\//,
    /^\/assets\//,
    /^\/favicons\//,
    /^\/favicon\.ico$/,
    /^\/sw\.js$/,
    /^\/manifest\.json$/,
  ].some((regex) => regex.test(pathname));

  if (shouldSkip) {
    return NextResponse.next();
  }

  // 2. Check if the pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Determine user's locale preference: cookies -> Accept-Language header -> default (fr)
  let locale = defaultLocale;
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const acceptLang = request.headers.get("accept-language");
    if (acceptLang) {
      if (acceptLang.includes("ar")) {
        locale = "ar";
      } else if (acceptLang.includes("en")) {
        locale = "en";
      }
    }
  }

  // Read status from env vars
  const status = process.env.NEXT_PUBLIC_WEBSITE_STATUS || process.env.WEBSITE_STATUS || "online";
  const isConstructionMode = status === "construction" || status === "coming-soon" || status === "under-construction";

  // Case A: Website is in construction/coming-soon mode
  if (isConstructionMode) {
    // If no locale in URL, redirect directly to localized coming-soon page
    if (!pathnameHasLocale) {
      request.nextUrl.pathname = `/${locale}/coming-soon`;
      return NextResponse.redirect(request.nextUrl);
    }

    // Extract the locale and post-locale path
    const segments = pathname.split("/").filter(Boolean);
    const urlLocale = segments[0];
    const pathAfterLocale = segments.slice(1).join("/");

    // If it has locale but is not on coming-soon page, redirect to coming-soon
    if (pathAfterLocale !== "coming-soon") {
      request.nextUrl.pathname = `/${urlLocale}/coming-soon`;
      return NextResponse.redirect(request.nextUrl);
    }

    return NextResponse.next();
  }

  // Case B: Website is ONLINE (Normal mode)
  // If no locale prefix, redirect to localized URL (e.g. /contact -> /fr/contact)
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // If page is /coming-soon when site is online, redirect back to home page
  const segments = pathname.split("/").filter(Boolean);
  const urlLocale = segments[0];
  const pathAfterLocale = segments.slice(1).join("/");
  if (pathAfterLocale === "coming-soon") {
    request.nextUrl.pathname = `/${urlLocale}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip API paths (/api), static assets (/assets), next.js internal assets, and static files
    "/((?!api|_next/static|_next/image|assets|favicons|favicon.ico|sw.js).*)",
  ],
};
