import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value; // We need to store role in cookie as well, or decode token

    // For now, let's assume if they have a token they are at least logged in
    // We'll need to update the login logic to store the role in a cookie for this middleware to work perfectly on the edge
    // Or simply rely on client-side redirect for role, and middleware for auth presence.

    // Simple check: Is user logged in?
    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!token && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If trying to access admin but not admin (we'll implement cookie role check next)
    if (request.nextUrl.pathname.startsWith('/admin') && role === 'STUDENT') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
