import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import BackendWarmup from '@/components/BackendWarmup';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap', // Faster font loading
    preload: true,
});

export const metadata: Metadata = {
    title: 'Indian College OS - Student Management Platform',
    description: 'The Ultimate Student Management Platform for Indian Colleges',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'College OS',
    },
    openGraph: {
        title: 'Indian College OS',
        description: 'The Ultimate Student Management Platform',
        type: 'website',
    },
};

export const viewport: Viewport = {
    themeColor: '#1e40af',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="apple-touch-icon" href="/icon-192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
                {/* Preconnect to backend for faster API calls */}
                <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'https://college-management-mvp.onrender.com'} />
                <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || 'https://college-management-mvp.onrender.com'} />
            </head>
            <body className={inter.className}>
                <ThemeProvider>
                    <AuthProvider>
                        <BackendWarmup />
                        {children}
                        <ServiceWorkerRegistration />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
