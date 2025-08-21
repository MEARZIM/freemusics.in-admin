import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don’t need auth
const publicRoutes = [
  /^\/signin(.*)$/, 
  /^\/signup(.*)$/, 
  /^\/api(.*)$/   
];

function isPublicRoute(pathname: string) {
  return publicRoutes.some((regex) => regex.test(pathname));
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const signInUrl = new URL("/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
