/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Primary: Deep Navy Blue
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#1e40af', // Main primary
                    600: '#1e3a8a',
                    700: '#1e3a8a',
                    800: '#172554',
                    900: '#0f172a',
                },
                // Neutral Grays
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
                // Success Green (subtle)
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                },
                // Warning/Error
                warning: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                },
                error: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                },
            },
            fontFamily: {
                sans: ['Inter', 'IBM Plex Sans', 'system-ui', '-apple-system', 'sans-serif'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['0.9375rem', { lineHeight: '1.5rem' }], // 15px
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            maxWidth: {
                'container': '1200px',
            },
            boxShadow: {
                'soft': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
            },
            borderRadius: {
                'sm': '4px',
                'DEFAULT': '6px',
                'md': '8px',
                'lg': '10px',
            },
        },
    },
    plugins: [],
}
