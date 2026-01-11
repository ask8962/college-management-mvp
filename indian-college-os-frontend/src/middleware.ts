import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Redirect to login if no token present
    if (!token) {
        if (request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname.startsWith('/admin') ||
            request.nextUrl.pathname.startsWith('/gigs')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        // Verify JWT signature using the secret
        // Note: JWT_SECRET must be set in frontend environment variables
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-256-bit-secret-key-here-change-in-production');
        const { payload } = await jwtVerify(token, secret);

        const role = payload.role as string;

        // Enforce Admin Access
        if (request.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

    } catch (error) {
        // Token invalid or expired - redirect to login
        // We should also probably clear the cookie here, but response modification is tricky in middleware
        // Best to just redirect and let the login page handle the fresh login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/gigs/:path*'],
};
