import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["fr", "en", "ar"];
const defaultLocale = "fr";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Determine locale preference: cookie -> Accept-Language header -> default (fr)
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

  // Redirect the request to include the locale prefix
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip API paths (/api), static assets (/assets), next.js internal assets, and static files
    "/((?!api|_next/static|_next/image|assets|favicons|favicon.ico|sw.js).*)",
  ],
};
