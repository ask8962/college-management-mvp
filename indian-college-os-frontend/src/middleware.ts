import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Middleware only checks authentication presence.
    // Role-based authorization is enforced by:
    // 1. Backend API (JWT contains role, verified server-side)
    // 2. Client-side layout (redirects non-admins away from /admin)
    // We do NOT use a role cookie because it's client-controllable (security risk).

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!token && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!token && request.nextUrl.pathname.startsWith('/gigs')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/gigs/:path*'],
};
