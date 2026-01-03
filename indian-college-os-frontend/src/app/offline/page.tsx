'use client';

import Link from 'next/link';
import { WifiOff, Home, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-8 max-w-md text-center">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <WifiOff className="h-10 w-10 text-orange-400" />
                </div>

                <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
                <p className="text-gray-400 mb-6">
                    No internet connection detected. Please check your connection and try again.
                </p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </button>
                    <Link href="/dashboard" className="btn-primary flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Go Home
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    College OS works best with an internet connection
                </p>
            </div>
        </div>
    );
}
