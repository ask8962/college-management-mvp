'use client';

import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://college-management-mvp.onrender.com';

/**
 * BackendWarmup Component
 * 
 * Pings the backend on app load to wake it up from cold start.
 * Render's free tier spins down after 15 mins of inactivity.
 * This component sends a lightweight health check request immediately.
 */
export default function BackendWarmup() {
    useEffect(() => {
        // Warm up the backend immediately on app load
        const warmupBackend = async () => {
            try {
                // Simple health check - doesn't need to wait for response
                fetch(`${API_URL}/health`, {
                    method: 'GET',
                    mode: 'no-cors', // Avoid CORS issues for warmup
                }).catch(() => {
                    // Silently fail - this is just a warmup
                });
            } catch {
                // Ignore errors - warmup is best effort
            }
        };

        warmupBackend();
    }, []);

    return null; // This component doesn't render anything
}
